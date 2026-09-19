// src/components/motion/index.tsx
//
// AstraX motion system. One module so every surface pulls from the same
// vocabulary. Techniques adapted from the supplied animation catalogue and
// re-tuned for the "Case File Noir" palette + investigative domain:
//   · Reveal / RevealGroup      → "a file being placed on a desk"
//   · TiltCard                  → handling a physical evidence card
//   · GlassPanel                → frosted chrome over warm graphite
//   · SegmentedControl          → sliding layoutId indicator
//   · CountUp                   → document/entity/confidence counters
//   · ParticleField             → deterministic ambient dust
//   · CursorThread              → "connecting thread" pointer trail
//   · ScrollProgress            → case-progress indicator
//   · ShimmerText               → reserved hero moments
//
// EVERY primitive is inert under `prefers-reduced-motion`, and the pointer
// effects additionally require `pointer: fine` (no phantom cost on touch).

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";
import {
    AnimatePresence,
    motion,
    useInView,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type Variants,
} from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────
   Shared easing / duration vocabulary
   ──────────────────────────────────────────────────────────────────────── */
export const SETTLE = [0.16, 1, 0.3, 1] as const;
export const SNAP = [0.2, 0.9, 0.2, 1] as const;

/** True when we are allowed to animate at all. */
export function useMotionOK() {
    const reduce = useReducedMotion();
    return !reduce;
}

/** True only on precise pointers (desktop) with motion allowed. */
export function useFinePointer() {
    const [fine, setFine] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mq = window.matchMedia("(pointer: fine)");
        setFine(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);
    return fine;
}

/* ────────────────────────────────────────────────────────────────────────
   Reveal — the core "case file settling" entrance
   ──────────────────────────────────────────────────────────────────────── */
interface RevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    /** slight rotation so material lands like paper, not like a div */
    tilt?: number;
    once?: boolean;
    style?: CSSProperties;
    id?: string;
}

export function Reveal({
    children,
    className = "",
    delay = 0,
    y = 16,
    tilt = 0.35,
    once = true,
    style,
    id,
}: RevealProps) {
    const ok = useMotionOK();
    if (!ok) {
        return (
            <div id={id} className={className} style={style}>
                {children}
            </div>
        );
    }
    return (
        <motion.div
            id={id}
            className={className}
            style={style}
            initial={{ opacity: 0, y, rotate: -tilt, scale: 0.988 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            viewport={{ once, margin: "-60px 0px -40px 0px" }}
            transition={{ duration: 0.55, delay, ease: SETTLE as [number, number, number, number] }}
        >
            {children}
        </motion.div>
    );
}

const groupVariants: Variants = {
    hidden: {},
    shown: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, rotate: -0.3, scale: 0.99 },
    shown: {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: { duration: 0.5, ease: SETTLE as [number, number, number, number] },
    },
};

export function RevealGroup({
    children,
    className = "",
    id,
}: {
    children: ReactNode;
    className?: string;
    id?: string;
}) {
    const ok = useMotionOK();
    if (!ok) return <div id={id} className={className}>{children}</div>;
    return (
        <motion.div
            id={id}
            className={className}
            variants={groupVariants}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "-50px" }}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({
    children,
    className = "",
    id,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    id?: string;
    onClick?: () => void;
}) {
    const ok = useMotionOK();
    if (!ok)
        return (
            <div id={id} className={className} onClick={onClick}>
                {children}
            </div>
        );
    return (
        <motion.div id={id} className={className} variants={itemVariants} onClick={onClick}>
            {children}
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   GlassPanel — frosted chrome with an optional hover lift
   ──────────────────────────────────────────────────────────────────────── */
export function GlassPanel({
    children,
    className = "",
    hover = false,
    strong = false,
    id,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    strong?: boolean;
    id?: string;
    onClick?: () => void;
}) {
    const ok = useMotionOK();
    return (
        <motion.div
            id={id}
            onClick={onClick}
            className={`${strong ? "glass-strong" : "glass"} lit-edge rounded-xl ${
                hover ? "shine-sweep cursor-pointer" : ""
            } ${className}`}
            whileHover={hover && ok ? { y: -3, transition: { duration: 0.22, ease: SNAP as [number, number, number, number] } } : undefined}
        >
            {children}
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   TiltCard — 3D tilt + pointer-tracked sheen.
   Desktop only (pointer:fine). CSS transform only → compositor-cheap, safe
   to have several on screen alongside the graph's rAF loop.
   ──────────────────────────────────────────────────────────────────────── */
export function TiltCard({
    children,
    className = "",
    max = 6,
    glare = true,
    id,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    max?: number;
    glare?: boolean;
    id?: string;
    onClick?: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const ok = useMotionOK();
    const fine = useFinePointer();
    const enabled = ok && fine;

    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 22 });
    const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 22 });
    const glareX = useTransform(px, (v) => `${(v * 100).toFixed(1)}%`);
    const glareY = useTransform(py, (v) => `${(v * 100).toFixed(1)}%`);
    const glareBg = useMotionTemplate`radial-gradient(320px circle at ${glareX} ${glareY}, rgba(246,242,237,0.075), transparent 62%)`;

    if (!enabled) {
        return (
            <div ref={ref} id={id} className={className} onClick={onClick}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            id={id}
            onClick={onClick}
            className={`group relative ${className}`}
            style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: "preserve-3d" }}
            onPointerMove={(e) => {
                const r = ref.current?.getBoundingClientRect();
                if (!r) return;
                px.set((e.clientX - r.left) / r.width);
                py.set((e.clientY - r.top) / r.height);
            }}
            onPointerLeave={() => {
                px.set(0.5);
                py.set(0.5);
            }}
        >
            {children}
            {glare && (
                <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: glareBg }}
                />
            )}
        </motion.div>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   SegmentedControl — sliding layoutId pill (Act switcher, graph tabs,
   hypothesis toggle)
   ──────────────────────────────────────────────────────────────────────── */
export interface SegmentItem {
    id: string;
    label: string;
    hint?: string;
    icon?: ReactNode;
    count?: number;
}

export function SegmentedControl({
    items,
    value,
    onChange,
    layoutId = "segment-pill",
    size = "md",
    className = "",
}: {
    items: SegmentItem[];
    value: string;
    onChange: (id: string) => void;
    layoutId?: string;
    size?: "sm" | "md";
    className?: string;
}) {
    const ok = useMotionOK();
    const pad = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs";
    return (
        <div
            role="tablist"
            className={`inline-flex items-center gap-0.5 rounded-xl border border-surface-300 bg-surface-100/80 p-1 backdrop-blur ${className}`}
        >
            {items.map((it) => {
                const active = it.id === value;
                return (
                    <button
                        key={it.id}
                        role="tab"
                        aria-selected={active}
                        type="button"
                        onClick={() => onChange(it.id)}
                        title={it.hint}
                        className={`relative flex items-center gap-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${pad} ${
                            active ? "text-surface-900" : "text-surface-500 hover:text-surface-700"
                        }`}
                    >
                        {active && (
                            <motion.span
                                layoutId={ok ? layoutId : undefined}
                                className="absolute inset-0 rounded-lg border border-ember-500/45 bg-ember-500/15"
                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                            {it.icon}
                            {it.label}
                            {typeof it.count === "number" && (
                                <span
                                    className={`font-mono text-[10px] ${
                                        active ? "text-ember-300" : "text-surface-500"
                                    }`}
                                >
                                    {it.count}
                                </span>
                            )}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   CountUp — animated counters for evidence/entity/confidence figures
   ──────────────────────────────────────────────────────────────────────── */
export function CountUp({
    value,
    decimals = 0,
    suffix = "",
    prefix = "",
    duration = 1.1,
    className = "",
}: {
    value: number;
    decimals?: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-40px" });
    const ok = useMotionOK();
    const [shown, setShown] = useState(ok ? 0 : value);

    useEffect(() => {
        if (!ok) {
            setShown(value);
            return;
        }
        if (!inView) return;
        let raf = 0;
        const start = performance.now();
        const from = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / (duration * 1000));
            // easeOutExpo — fast settle, no bounce
            const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setShown(from + (value - from) * e);
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value, duration, ok]);

    return (
        <span ref={ref} className={`font-mono tabular-nums ${className}`}>
            {prefix}
            {shown.toFixed(decimals)}
            {suffix}
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   ParticleField — deterministic ambient "case dust"
   Seeded PRNG so every render is identical (no hydration jitter), capped at
   ~30fps and paused when off-screen or reduced-motion.
   ──────────────────────────────────────────────────────────────────────── */
function mulberry32(seed: number) {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function ParticleField({
    count = 26,
    seed = 7,
    className = "",
    color = "rgba(216,152,115,0.55)",
}: {
    count?: number;
    seed?: number;
    className?: string;
    color?: string;
}) {
    const ok = useMotionOK();
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ok) return;
        const canvas = ref.current;
        const parent = canvas?.parentElement;
        if (!canvas || !parent) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rnd = mulberry32(seed);
        const dots = Array.from({ length: count }, () => ({
            x: rnd(),
            y: rnd(),
            r: 0.6 + rnd() * 1.6,
            vx: (rnd() - 0.5) * 0.00018,
            vy: -(0.00006 + rnd() * 0.00016),
            a: 0.15 + rnd() * 0.45,
            ph: rnd() * Math.PI * 2,
        }));

        let w = 0;
        let h = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const resize = () => {
            const r = parent.getBoundingClientRect();
            w = r.width;
            h = r.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(parent);

        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
            threshold: 0,
        });
        io.observe(parent);

        let raf = 0;
        let last = 0;
        const loop = (now: number) => {
            raf = requestAnimationFrame(loop);
            if (!visible || now - last < 33) return; // ~30fps budget
            const dt = Math.min(now - last, 60);
            last = now;
            ctx.clearRect(0, 0, w, h);
            for (const d of dots) {
                d.x += d.vx * dt;
                d.y += d.vy * dt;
                if (d.y < -0.05) d.y = 1.05;
                if (d.x < -0.05) d.x = 1.05;
                if (d.x > 1.05) d.x = -0.05;
                const twinkle = 0.65 + 0.35 * Math.sin(now / 1400 + d.ph);
                ctx.beginPath();
                ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
                ctx.fillStyle = color.replace(
                    /[\d.]+\)$/,
                    `${(d.a * twinkle).toFixed(3)})`
                );
                ctx.fill();
            }
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
        };
    }, [count, seed, color, ok]);

    if (!ok) return null;
    return (
        <canvas
            ref={ref}
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${className}`}
        />
    );
}

/* ────────────────────────────────────────────────────────────────────────
   CursorThread — a faint "connecting thread" that follows the pointer.
   Mounted ONLY over the knowledge-graph canvas and hero/empty backgrounds,
   never over dense text. Desktop + motion-allowed only. Single shared rAF,
   self-suspends after 500ms of no movement so it costs nothing at rest.
   ──────────────────────────────────────────────────────────────────────── */
export function CursorThread({
    color = "168,91,58",
    className = "",
}: {
    color?: string;
    className?: string;
}) {
    const ref = useRef<HTMLCanvasElement>(null);
    const ok = useMotionOK();
    const fine = useFinePointer();

    useEffect(() => {
        if (!ok || !fine) return;
        const canvas = ref.current;
        const parent = canvas?.parentElement;
        if (!canvas || !parent) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0;
        let h = 0;
        const resize = () => {
            const r = parent.getBoundingClientRect();
            w = r.width;
            h = r.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(parent);

        const pts: { x: number; y: number; t: number }[] = [];
        let raf = 0;
        let running = false;
        let lastMove = 0;

        const draw = () => {
            const now = performance.now();
            ctx.clearRect(0, 0, w, h);
            while (pts.length && now - pts[0].t > 620) pts.shift();
            if (pts.length > 1) {
                for (let i = 1; i < pts.length; i++) {
                    const p0 = pts[i - 1];
                    const p1 = pts[i];
                    const age = (now - p1.t) / 620;
                    const alpha = Math.max(0, 0.45 * (1 - age));
                    ctx.beginPath();
                    ctx.moveTo(p0.x, p0.y);
                    ctx.lineTo(p1.x, p1.y);
                    ctx.strokeStyle = `rgba(${color},${alpha.toFixed(3)})`;
                    ctx.lineWidth = Math.max(0.4, 1.6 * (1 - age));
                    ctx.lineCap = "round";
                    ctx.stroke();
                }
                const head = pts[pts.length - 1];
                ctx.beginPath();
                ctx.arc(head.x, head.y, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},0.55)`;
                ctx.fill();
            }
            if (pts.length === 0 && now - lastMove > 500) {
                running = false;
                return; // suspend: zero cost at rest
            }
            raf = requestAnimationFrame(draw);
        };

        const onMove = (e: PointerEvent) => {
            const r = parent.getBoundingClientRect();
            pts.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
            if (pts.length > 26) pts.shift();
            lastMove = performance.now();
            if (!running) {
                running = true;
                raf = requestAnimationFrame(draw);
            }
        };

        parent.addEventListener("pointermove", onMove);
        return () => {
            parent.removeEventListener("pointermove", onMove);
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [ok, fine, color]);

    if (!ok || !fine) return null;
    return (
        <canvas
            ref={ref}
            aria-hidden
            className={`pointer-events-none absolute inset-0 z-10 ${className}`}
        />
    );
}

/* ────────────────────────────────────────────────────────────────────────
   ScrollProgress — "case progress" hairline for a scroll container
   ──────────────────────────────────────────────────────────────────────── */
export function ScrollProgress({
    targetRef,
    className = "",
}: {
    targetRef: React.RefObject<HTMLElement | null>;
    className?: string;
}) {
    const [p, setP] = useState(0);
    useEffect(() => {
        const el = targetRef.current;
        if (!el) return;
        const onScroll = () => {
            const max = el.scrollHeight - el.clientHeight;
            setP(max <= 0 ? 0 : Math.min(1, Math.max(0, el.scrollTop / max)));
        };
        onScroll();
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [targetRef]);

    return (
        <div className={`h-px w-full bg-surface-300/70 ${className}`}>
            <div
                className="h-px bg-gradient-to-r from-ember-600 via-ember-400 to-ember-200 transition-[width] duration-150 ease-out"
                style={{ width: `${(p * 100).toFixed(2)}%` }}
            />
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────
   ShimmerText — used exactly twice (landing headline, case-file wordmark)
   ──────────────────────────────────────────────────────────────────────── */
export function ShimmerText({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return <span className={`text-shimmer ${className}`}>{children}</span>;
}

export { AnimatePresence, motion };
