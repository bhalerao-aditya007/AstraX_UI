// src/components/dashboard/analytics/NetworkGraph.tsx
//
// Same engine (d3-force + canvas), same props, same filters — the physics,
// drag, pan/zoom, temporal filter, hypothesis layer and flowing edge
// particles all survive. What changed is the *rendering*:
//
//   · nodes get radial-gradient bodies, a soft outer halo and a crisp rim
//     (depth, not flat fills)
//   · label density is governed: above ~18 nodes, labels are hover-scoped;
//     edge chips only draw when the graph is legible at the current zoom
//   · hover dims the rest of the graph so one thread reads at a time
//   · hypothesis edges/nodes keep the DESIGN.md contract: dashed, violet,
//     desaturated, gently animated ("unresolved"); confirmed links are
//     solid, sharp and static ("locked in")
//   · the rAF loop now suspends when off-screen, when the tab is hidden and
//     under prefers-reduced-motion — so ambient motion never competes with
//     the rest of the page for frames.

import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
} from "d3-force";
import type { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import { NODE_THEME_COLORS, EDGE_COLORS } from "../../../theme/colors";
import Icon from "../../ui/Icon";
import Chip from "../../ui/Chip";
import { CursorThread, useMotionOK } from "../../motion";

interface NetworkNode extends SimulationNodeDatum {
    id: string;
    label: string;
    type: string;
    badge?: string;
    risk_score?: number;
    is_phantom?: boolean;
    attributes?: Record<string, any>;
    details?: Record<string, any>;
    merge_reason?: string;
}

interface NetworkLink extends SimulationLinkDatum<NetworkNode> {
    id: string;
    source: string | NetworkNode;
    target: string | NetworkNode;
    label: string;
    color?: string;
    style?: string;
    weight?: number;
    probability?: number;
    is_hypothesis?: boolean;
    valid_from?: string;
    valid_to?: string;
    merge_reason?: string;
}

interface NetworkGraphProps {
    data: {
        nodes: any[];
        edges: any[];
    };
    onNodeClick?: (node: any) => void;
    onEdgeClick?: (edge: any) => void;
    theme?: "financial" | "digital" | "communication" | "evidence" | "default";
    showControls?: boolean;
    title?: string;
}

const NODE_RADIUS = 21;
/** above this node count, labels become hover-scoped to keep the plate legible */
const DENSE_THRESHOLD = 18;

export default function NetworkGraph({
    data,
    onNodeClick,
    theme = "default",
    showControls = true,
    title,
}: NetworkGraphProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const motionOK = useMotionOK();

    // Progressive disclosure controls (unchanged behaviour)
    const [showHypotheses, setShowHypotheses] = useState(false);
    const [temporalDate, setTemporalDate] = useState<string>("2026-09-30");

    const filteredEdges = useMemo(() => {
        return (data.edges || []).filter((edge) => {
            const isHypo =
                edge.is_hypothesis || edge.category === "hypothesis" || edge.style === "dashed";
            if (isHypo && !showHypotheses) return false;
            if (edge.valid_from && edge.valid_from > temporalDate) return false;
            return true;
        });
    }, [data.edges, showHypotheses, temporalDate]);

    const activeNodeIds = useMemo(() => {
        const set = new Set<string>();
        for (const edge of filteredEdges) {
            const sId = typeof edge.source === "object" ? edge.source.id : edge.source;
            const tId = typeof edge.target === "object" ? edge.target.id : edge.target;
            set.add(sId);
            set.add(tId);
        }
        return set;
    }, [filteredEdges]);

    const filteredNodes = useMemo(() => {
        return (data.nodes || []).filter((node) => {
            if (node.is_phantom && !showHypotheses && !activeNodeIds.has(node.id)) return false;
            return true;
        });
    }, [data.nodes, showHypotheses, activeNodeIds]);

    const rawNodes = useMemo(() => filteredNodes.map((n: any) => ({ ...n })), [filteredNodes]);
    const rawLinks = useMemo(() => filteredEdges.map((e: any) => ({ ...e })), [filteredEdges]);

    const nodesRef = useRef<NetworkNode[]>(rawNodes);
    const linksRef = useRef<NetworkLink[]>(rawLinks);

    useEffect(() => {
        nodesRef.current = rawNodes;
        linksRef.current = rawLinks;
    }, [rawNodes, rawLinks]);

    const transformRef = useRef({ x: 0, y: 0, k: 1 });
    const hoveredRef = useRef<string | null>(null);
    const simRef = useRef<any>(null);

    const dense = rawNodes.length > DENSE_THRESHOLD;
    const denseRef = useRef(dense);
    useEffect(() => {
        denseRef.current = dense;
    }, [dense]);

    const hitTest = useCallback((mx: number, my: number): NetworkNode | null => {
        const t = transformRef.current;
        const wx = (mx - t.x) / t.k;
        const wy = (my - t.y) / t.k;
        for (let i = nodesRef.current.length - 1; i >= 0; i--) {
            const n = nodesRef.current[i];
            const dx = (n.x ?? 0) - wx;
            const dy = (n.y ?? 0) - wy;
            if (dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS) return n;
        }
        return null;
    }, []);

    /* ── Renderer ─────────────────────────────────────────────────────── */
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.save();
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const { x, y, k } = transformRef.current;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(k, k);

        // keep nodes inside the plate
        for (const node of nodesRef.current) {
            if (node.x == null || node.y == null) continue;
            const padding = NODE_RADIUS + 14;
            const hw = canvas.width / (2 * k) - padding;
            const hh = canvas.height / (2 * k) - padding;
            if (node.x > hw) node.x = hw;
            if (node.x < -hw) node.x = -hw;
            if (node.y > hh) node.y = hh;
            if (node.y < -hh) node.y = -hh;
        }

        const themeMapping = NODE_THEME_COLORS[theme] || NODE_THEME_COLORS.default;
        const hoveredId = hoveredRef.current;
        const isDense = denseRef.current;
        const timeNow = Date.now() / 1000;

        // adjacency of the hovered node → everything else recedes
        const focus = new Set<string>();
        if (hoveredId) {
            focus.add(hoveredId);
            for (const l of linksRef.current) {
                const s = (l.source as NetworkNode)?.id ?? (l.source as unknown as string);
                const e = (l.target as NetworkNode)?.id ?? (l.target as unknown as string);
                if (s === hoveredId) focus.add(e as string);
                if (e === hoveredId) focus.add(s as string);
            }
        }

        /* ── Edges ───────────────────────────────────────────────────── */
        for (const link of linksRef.current) {
            const s = link.source as NetworkNode;
            const e = link.target as NetworkNode;
            if (!s || !e || s.x == null || s.y == null || e.x == null || e.y == null) continue;

            const dx = e.x - s.x;
            const dy = e.y - s.y;
            const dist = Math.hypot(dx, dy);
            if (dist === 0) continue;

            const pad = NODE_RADIUS + 3;
            const sx = s.x + (dx * pad) / dist;
            const sy = s.y + (dy * pad) / dist;
            const tx = e.x - (dx * pad) / dist;
            const ty = e.y - (dy * pad) / dist;

            const isHypothesis = link.is_hypothesis || link.style === "dashed";
            const inFocus = !hoveredId || (focus.has(s.id) && focus.has(e.id));
            ctx.globalAlpha = inFocus ? 1 : 0.13;

            // Confirmed edges fade from source→target so flow direction reads
            // without shouting; hypothesis edges stay flat and desaturated.
            let stroke: string | CanvasGradient;
            if (isHypothesis) {
                stroke = EDGE_COLORS.hypothesis;
            } else if (link.color) {
                stroke = link.color;
            } else {
                const g = ctx.createLinearGradient(sx, sy, tx, ty);
                g.addColorStop(0, "rgba(123,115,110,0.35)");
                g.addColorStop(1, inFocus && hoveredId ? EDGE_COLORS.confirmedActive : "rgba(123,115,110,0.95)");
                stroke = g;
            }

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = stroke;
            ctx.lineCap = "round";
            if (isHypothesis) {
                ctx.lineWidth = 1.6;
                ctx.setLineDash([5, 6]);
                // slow crawl = "unresolved, still moving"
                ctx.lineDashOffset = motionOK ? -(timeNow * 8) % 11 : 0;
            } else {
                ctx.lineWidth = link.weight ? Math.min(3, 1 + link.weight * 0.45) : 1.4;
                ctx.setLineDash([]);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // arrowhead — small, sharp, never dominant
            const angle = Math.atan2(dy, dx);
            const a = 6.5;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx - a * Math.cos(angle - Math.PI / 7), ty - a * Math.sin(angle - Math.PI / 7));
            ctx.lineTo(tx - a * Math.cos(angle + Math.PI / 7), ty - a * Math.sin(angle + Math.PI / 7));
            ctx.closePath();
            ctx.fillStyle = isHypothesis ? EDGE_COLORS.hypothesis : link.color || "#8b827c";
            ctx.fill();

            // travelling particle — data in motion along a confirmed channel
            if (motionOK && inFocus) {
                const speed = 0.4 + (link.weight ? link.weight * 0.12 : 0.18);
                const phase = ((s.id?.length ?? 3) * 3 + (e.id?.length ?? 5) * 7) * 0.11;
                const t = (timeNow * speed + phase) % 1;
                const px = sx + (tx - sx) * t;
                const py = sy + (ty - sy) * t;
                ctx.beginPath();
                ctx.arc(px, py, isHypothesis ? 1.9 : 2.2, 0, Math.PI * 2);
                ctx.fillStyle = isHypothesis
                    ? EDGE_COLORS.hypothesisParticle
                    : link.color || EDGE_COLORS.particle;
                ctx.shadowColor = ctx.fillStyle as string;
                ctx.shadowBlur = 7;
                ctx.globalAlpha = (inFocus ? 1 : 0.13) * (isHypothesis ? 0.75 : 1);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // edge chips: only when the plate can carry them
            const wantsLabel =
                link.label &&
                ((!isDense && k > 0.72) || (hoveredId && focus.has(s.id) && focus.has(e.id)));
            if (wantsLabel) {
                const mx = (s.x + e.x) / 2;
                const my = (s.y + e.y) / 2;
                ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const text =
                    link.label.length > 26 ? `${link.label.slice(0, 25)}…` : link.label;
                const w = ctx.measureText(text).width + 10;
                ctx.globalAlpha = inFocus ? 1 : 0.1;
                ctx.beginPath();
                ctx.roundRect(mx - w / 2, my - 14, w, 15, 4);
                ctx.fillStyle = EDGE_COLORS.labelBg;
                ctx.fill();
                ctx.strokeStyle = isHypothesis
                    ? "rgba(135,118,209,0.45)"
                    : EDGE_COLORS.labelBorder;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = isHypothesis ? "#c3b9f0" : EDGE_COLORS.labelText;
                ctx.fillText(text, mx, my - 6.5);
            }
            ctx.globalAlpha = 1;
        }

        /* ── Nodes ───────────────────────────────────────────────────── */
        for (const node of nodesRef.current) {
            if (node.x == null || node.y == null) continue;

            const isHovered = hoveredId === node.id;
            const inFocus = !hoveredId || focus.has(node.id);
            const colors = themeMapping[node.type] || themeMapping.default;
            const isPhantom = node.is_phantom || node.type === "phantom";
            const highRisk = (node.risk_score ?? 0) > 0.8;

            ctx.save();
            ctx.translate(node.x, node.y);
            ctx.globalAlpha = inFocus ? 1 : 0.16;

            // risk halo — breathing, red, unmistakable
            if (highRisk) {
                const pulse = motionOK ? Math.sin(timeNow * 2.6 + node.id.length * 0.7) * 2.4 : 0;
                ctx.beginPath();
                ctx.arc(0, 0, NODE_RADIUS + 6 + pulse, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(220,90,84,0.4)";
                ctx.lineWidth = 1.4;
                ctx.stroke();
            }

            // soft glow for hover / phantom
            if (isHovered || isPhantom) {
                const pulse =
                    isPhantom && motionOK ? Math.sin(timeNow * 2.2 + node.id.length * 0.5) * 2.2 : 0;
                ctx.beginPath();
                ctx.arc(0, 0, NODE_RADIUS + 9 + pulse, 0, Math.PI * 2);
                ctx.fillStyle = isPhantom ? "rgba(135,118,209,0.16)" : colors.glow;
                ctx.fill();
            }

            // body fill — radial gradient gives the node a lit top edge
            const grad = ctx.createRadialGradient(
                -NODE_RADIUS * 0.35,
                -NODE_RADIUS * 0.45,
                NODE_RADIUS * 0.15,
                0,
                0,
                NODE_RADIUS * 1.15
            );
            grad.addColorStop(0, colors.fill);
            grad.addColorStop(1, colors.fillEdge || colors.fill);

            const drawBody = (path: () => void) => {
                path();
                ctx.fillStyle = isPhantom ? "#1c1830" : (grad as CanvasGradient);
                ctx.fill();
                ctx.strokeStyle = colors.stroke;
                ctx.lineWidth = isHovered ? 2.2 : 1.25;
                if (isPhantom) ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            };

            if (isPhantom) {
                drawBody(() => {
                    ctx.beginPath();
                    ctx.arc(0, 0, NODE_RADIUS, 0, Math.PI * 2);
                });
            } else if (node.type === "company" || node.type === "bank_account" || node.type === "account") {
                drawBody(() => {
                    ctx.beginPath();
                    ctx.roundRect(-NODE_RADIUS, -NODE_RADIUS, NODE_RADIUS * 2, NODE_RADIUS * 2, 7);
                });
            } else if (node.type === "wallet" || node.type === "device" || node.type === "server" || node.type === "ip") {
                drawBody(() => {
                    ctx.beginPath();
                    for (let i = 0; i < 6; i++) {
                        const ang = (Math.PI / 3) * i - Math.PI / 6;
                        const hx = NODE_RADIUS * Math.cos(ang);
                        const hy = NODE_RADIUS * Math.sin(ang);
                        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
                    }
                    ctx.closePath();
                });
            } else {
                drawBody(() => {
                    ctx.beginPath();
                    ctx.arc(0, 0, NODE_RADIUS, 0, Math.PI * 2);
                });
            }

            // inner specular arc — the "tactile" cue
            ctx.beginPath();
            ctx.arc(0, 0, NODE_RADIUS - 3.5, Math.PI * 1.15, Math.PI * 1.75);
            ctx.strokeStyle = "rgba(246,242,237,0.16)";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // high-risk marker
            if (highRisk) {
                ctx.beginPath();
                ctx.arc(NODE_RADIUS * 0.68, -NODE_RADIUS * 0.68, 4.4, 0, Math.PI * 2);
                ctx.fillStyle = "#dc5a54";
                ctx.fill();
                ctx.strokeStyle = "#0e0d0c";
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }

            // glyph / initials inside the node
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (isPhantom) {
                ctx.fillStyle = "#c3b9f0";
                ctx.font = "bold 13px ui-monospace, monospace";
                ctx.fillText("?", 0, 0);
            } else {
                const initials = (node.label || "?")
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w: string) => w.replace(/[^A-Za-z0-9]/g, "").charAt(0))
                    .join("")
                    .toUpperCase();
                ctx.fillStyle = "rgba(14,13,12,0.82)";
                ctx.font = "bold 11px 'Inter', system-ui, sans-serif";
                ctx.fillText(initials || "•", 0, 0.5);
            }

            // label chip beneath the node
            const wantsLabel = !isDense || isHovered || (hoveredId ? focus.has(node.id) : false);
            if (wantsLabel) {
                const raw = node.label || "";
                const text = raw.length > 22 ? `${raw.slice(0, 21)}…` : raw;
                ctx.font = "10px 'Inter', system-ui, sans-serif";
                const w = ctx.measureText(text).width + 12;
                const cy = NODE_RADIUS + 13;
                ctx.beginPath();
                ctx.roundRect(-w / 2, cy - 8, w, 16, 5);
                ctx.fillStyle = "rgba(20,19,18,0.9)";
                ctx.fill();
                ctx.strokeStyle = isPhantom
                    ? "rgba(135,118,209,0.4)"
                    : "rgba(48,45,43,0.95)";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = isHovered ? "#f6f2ed" : "#c4bcb5";
                ctx.fillText(text, 0, cy);

                if ((node.badge || isPhantom) && (isHovered || !isDense)) {
                    ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace";
                    ctx.fillStyle = isPhantom ? "#a99ce4" : "#6e6763";
                    const badge = isPhantom
                        ? "HYPOTHESIS"
                        : (node.badge || "").slice(0, 30);
                    ctx.fillText(badge, 0, cy + 14);
                }
            }

            ctx.restore();
        }

        ctx.restore();
    }, [theme, motionOK]);

    /* ── Simulation ───────────────────────────────────────────────────── */
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (transformRef.current.x === 0 && transformRef.current.y === 0) {
                transformRef.current.x = rect.width / 2;
                transformRef.current.y = rect.height / 2;
            }
        };
        resize();

        const sim = forceSimulation<NetworkNode>(nodesRef.current)
            .force(
                "link",
                forceLink<NetworkNode, NetworkLink>(linksRef.current)
                    .id((d) => d.id)
                    .distance(118)
            )
            .force("charge", forceManyBody().strength(-340))
            .force("center", forceCenter(0, 0))
            .force("collide", forceCollide(NODE_RADIUS + 16));

        for (let i = 0; i < 44; ++i) sim.tick();
        sim.on("tick", render);
        simRef.current = sim;

        const ro = new ResizeObserver(() => {
            resize();
            render();
        });
        ro.observe(container);

        return () => {
            sim.stop();
            ro.disconnect();
        };
    }, [render, rawNodes, rawLinks]);

    /* ── Ambient loop, budgeted ───────────────────────────────────────── */
    useEffect(() => {
        // Under reduced motion we render on demand only (sim ticks + input).
        if (!motionOK) {
            render();
            return;
        }
        const container = containerRef.current;
        let visible = true;
        const io = container
            ? new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
            : null;
        if (io && container) io.observe(container);

        let animId = 0;
        let running = true;
        const loop = () => {
            if (!running) return;
            if (visible && document.visibilityState === "visible") render();
            animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);

        return () => {
            running = false;
            cancelAnimationFrame(animId);
            io?.disconnect();
        };
    }, [render, motionOK]);

    /* ── Pointer interaction (unchanged semantics) ────────────────────── */
    const dragRef = useRef<{ node: NetworkNode | null; offsetX: number; offsetY: number }>({
        node: null,
        offsetX: 0,
        offsetY: 0,
    });
    const panRef = useRef({ active: false, startX: 0, startY: 0, startTx: 0, startTy: 0 });

    const getMousePos = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        const node = hitTest(pos.x, pos.y);
        if (node) {
            dragRef.current = {
                node,
                offsetX: (node.x ?? 0) - (pos.x - transformRef.current.x) / transformRef.current.k,
                offsetY: (node.y ?? 0) - (pos.y - transformRef.current.y) / transformRef.current.k,
            };
            node.fx = node.x;
            node.fy = node.y;
            simRef.current?.alphaTarget(0.3).restart();
        } else {
            panRef.current = {
                active: true,
                startX: pos.x,
                startY: pos.y,
                startTx: transformRef.current.x,
                startTy: transformRef.current.y,
            };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const pos = getMousePos(e);

        if (dragRef.current.node) {
            const t = transformRef.current;
            dragRef.current.node.fx = (pos.x - t.x) / t.k + dragRef.current.offsetX;
            dragRef.current.node.fy = (pos.y - t.y) / t.k + dragRef.current.offsetY;
            render();
            return;
        }

        if (panRef.current.active) {
            transformRef.current.x = panRef.current.startTx + (pos.x - panRef.current.startX);
            transformRef.current.y = panRef.current.startTy + (pos.y - panRef.current.startY);
            render();
            return;
        }

        const node = hitTest(pos.x, pos.y);
        const canvas = canvasRef.current;
        if (canvas) canvas.style.cursor = node ? "pointer" : "grab";

        if (node) {
            if (hoveredRef.current !== node.id) {
                hoveredRef.current = node.id;
                render();
            }
        } else if (hoveredRef.current !== null) {
            hoveredRef.current = null;
            render();
        }
    };

    const handleMouseUp = () => {
        if (dragRef.current.node) {
            dragRef.current.node.fx = null;
            dragRef.current.node.fy = null;
            simRef.current?.alphaTarget(0);
            dragRef.current = { node: null, offsetX: 0, offsetY: 0 };
        }
        panRef.current.active = false;
    };

    const handleClick = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        const node = hitTest(pos.x, pos.y);
        if (node && onNodeClick) onNodeClick(node);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const pos = getMousePos(e);
        const t = transformRef.current;
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        const newK = Math.max(0.3, Math.min(3, t.k * factor));
        t.x = pos.x - (pos.x - t.x) * (newK / t.k);
        t.y = pos.y - (pos.y - t.y) * (newK / t.k);
        t.k = newK;
        render();
    };

    const resetZoom = () => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        transformRef.current = { x: rect.width / 2, y: rect.height / 2, k: 1 };
        render();
    };
    const zoomIn = () => {
        transformRef.current.k = Math.min(3, transformRef.current.k * 1.25);
        render();
    };
    const zoomOut = () => {
        transformRef.current.k = Math.max(0.3, transformRef.current.k * 0.8);
        render();
    };

    const hypothesisCount = (data.edges || []).filter(
        (e: any) => e.is_hypothesis || e.style === "dashed"
    ).length;

    /* ── Chrome ───────────────────────────────────────────────────────── */
    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-surface-300 bg-surface-0">
            {showControls && (
                <div className="z-20 flex flex-wrap items-center justify-between gap-3 border-b border-surface-300 bg-surface-100/80 px-4 py-2.5 backdrop-blur">
                    <div className="flex items-center gap-3">
                        {title && (
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-surface-600">
                                {title}
                            </span>
                        )}

                        {/* Hypothesis layer: the single most consequential toggle here */}
                        <button
                            type="button"
                            onClick={() => setShowHypotheses(!showHypotheses)}
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                                showHypotheses
                                    ? "hypothesis-surface border-purple-500/60 bg-purple-500/12 text-purple-300"
                                    : "border-surface-300 bg-surface-200/70 text-surface-500 hover:text-surface-800"
                            }`}
                            title="GNN-predicted links are hypotheses, never findings"
                        >
                            <span className="relative flex h-2.5 w-4 items-center">
                                <span
                                    className={`absolute inset-0 rounded-full border ${
                                        showHypotheses
                                            ? "border-purple-400/70 bg-purple-500/25"
                                            : "border-surface-400 bg-surface-300/60"
                                    }`}
                                />
                                <span
                                    className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all ${
                                        showHypotheses
                                            ? "left-[9px] bg-purple-300"
                                            : "left-[1px] bg-surface-500"
                                    }`}
                                />
                            </span>
                            <span>Hypothesis layer</span>
                            {hypothesisCount > 0 && (
                                <span className="opacity-70">({hypothesisCount})</span>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 font-mono text-[11px] text-surface-500">
                            <span className="hidden sm:inline">As of</span>
                            <input
                                type="date"
                                value={temporalDate}
                                onChange={(e) => setTemporalDate(e.target.value)}
                                className="rounded-md border border-surface-300 bg-surface-0 px-2 py-0.5 font-mono text-[11px] text-surface-700 outline-none focus:border-ember-500/70"
                            />
                        </label>

                        <div className="flex items-center gap-1 border-l border-surface-300 pl-3">
                            {[
                                { fn: zoomIn, label: "+", title: "Zoom in" },
                                { fn: zoomOut, label: "−", title: "Zoom out" },
                            ].map((b) => (
                                <button
                                    key={b.title}
                                    type="button"
                                    onClick={b.fn}
                                    title={b.title}
                                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-surface-300 bg-surface-200/70 text-xs font-bold text-surface-500 transition-colors hover:text-surface-900"
                                >
                                    {b.label}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={resetZoom}
                                title="Reset view"
                                className="flex h-6 cursor-pointer items-center justify-center rounded-md border border-surface-300 bg-surface-200/70 px-2 font-mono text-[10px] text-surface-500 transition-colors hover:text-surface-900"
                            >
                                reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Canvas plate */}
            <div
                ref={containerRef}
                className="relative min-h-[380px] w-full flex-1 bg-surface-0"
            >
                <div className="bg-tactical-grid pointer-events-none absolute inset-0 opacity-[0.55]" />
                <div className="bg-tactical-radar pointer-events-none absolute inset-0 opacity-70" />
                <CursorThread color="168,91,58" />

                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleClick}
                    onWheel={handleWheel}
                    className="absolute inset-0 h-full w-full select-none outline-none"
                />

                {rawNodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-surface-400 text-surface-500">
                                <Icon name="network-graph" size={20} />
                            </div>
                            <p className="font-display text-sm font-bold text-surface-700">
                                No linked entities yet
                            </p>
                            <p className="mx-auto mt-1 max-w-xs font-mono text-[11px] text-surface-500">
                                Ingest two or more corroborating exhibits to draw the first edge.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="z-20 flex flex-wrap items-center justify-between gap-3 border-t border-surface-300 bg-surface-100/80 px-4 py-2 backdrop-blur">
                <div className="flex flex-wrap items-center gap-2">
                    <Chip tone="confirmed" size="xs" dot>
                        Evidentiary link
                    </Chip>
                    <Chip tone="hypothesis" size="xs" dot>
                        GNN hypothesis — not a finding
                    </Chip>
                    <Chip tone="risk" size="xs" dot>
                        High risk
                    </Chip>
                </div>
                <div className="font-mono text-[10px] text-surface-500">
                    {rawNodes.length} nodes · {rawLinks.length} edges
                    {dense && " · labels on hover"}
                </div>
            </div>
        </div>
    );
}
