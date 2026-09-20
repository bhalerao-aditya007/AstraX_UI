// src/pages/Landing.tsx
// Section structure preserved (nav → hero → marquee → problem → features →
// visual insight → footer) exactly as required — only the visual language,
// motion vocabulary and copy emphasis changed. Image imports are unchanged
// (existing repo assets).

import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import dashboardImage from "../assets/dashboard.png";
import graphImage from "../assets/graph.png";
import Icon from "../components/ui/Icon";
import Chip, { Kicker } from "../components/ui/Chip";
import { ParticleField, Reveal, RevealGroup, RevealItem, ShimmerText, TiltCard } from "../components/motion";

const HeroScene = lazy(() => import("../components/landing/HeroScene.tsx"));

const marqueeItems = [
    { text: "National Automated Fingerprint Identification System (NAFIS) Biometric De-Duplication", color: "text-emerald-400" },
    { text: "Inter-State Cyber Syndicate Attribution & GNN Topology Reconstruction", color: "text-ember-300" },
    { text: "Multi-Banking CDR, IPDR & Layered Mule Account Financial Forensics", color: "text-surface-400" },
    { text: "Bharatiya Nyaya Sanhita (BNS) Statutory Offence Taxonomy & Section Mapping", color: "text-ember-200" },
    { text: "Decentralised Crypto Mixer Peel-Chain & Asset Recovery Tracking", color: "text-purple-300" },
    { text: "Air-Gapped Sovereign Digital Evidence Chain-of-Custody (BSA 2023)", color: "text-surface-400" },
];

const features = [
    {
        icon: "upload" as const,
        title: "Multi-Source Evidentiary Intake",
        desc: "Ingest and parse FIR text, scanned seizure memos, CCTV footage, wiretap audio, and bank CDR ledgers across isolated domain pipelines.",
    },
    {
        icon: "fingerprint" as const,
        title: "Entity Correlation & Disambiguation",
        desc: "Automatically correlate identifiers across fragmented systems to disambiguate targets, identify alias networks, and isolate shell entities.",
    },
    {
        icon: "network-graph" as const,
        title: "GNN Link Analysis & Reconstruction",
        desc: "Deploy Graph Neural Networks to uncover hidden criminal hierarchies, detect pass-through fund layering, and synthesise testable event theories.",
    },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-surface-0 font-sans text-surface-700 selection:bg-ember-500/30 selection:text-surface-900">
            {/* ── Nav ─────────────────────────────────────────────────── */}
            <nav className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between border-b border-surface-200/50 px-6">
                <div className="flex items-center gap-3">
                    <img
                        src="/astrax-logo.png"
                        alt="AstraX"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                        className="h-9 w-9 rounded-lg object-contain shadow-[0_0_18px_rgba(168,91,58,0.25)]"
                    />
                    <span className="font-display text-xl font-extrabold tracking-tight text-surface-900">
                        AstraX
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/dashboard"
                        className="rounded-lg border border-surface-300 bg-surface-100 px-4 py-2 text-xs font-semibold text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-900"
                    >
                        Case Directory
                    </Link>
                    <Link
                        to="/intake"
                        className="cursor-pointer rounded-lg bg-ember-500 px-4 py-2 text-xs font-bold text-surface-900 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] shadow-ember-500/20 transition-all hover:bg-ember-400"
                    >
                        Run Pipeline
                    </Link>
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="bg-records-room grain-overlay relative overflow-hidden pb-24 pt-12 lg:pb-32 lg:pt-20">
                <div className="bg-tactical-grid pointer-events-none absolute inset-0 opacity-20" />
                <ParticleField count={22} seed={3} className="opacity-70" />

                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-12">
                    <div className="max-w-2xl lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Chip tone="ember" size="md" live>
                                Criminal Network & Syndicate Analysis
                            </Chip>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 26 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 font-display text-4xl font-black leading-[1.1] tracking-tight text-surface-900 sm:text-5xl lg:text-6xl"
                        >
                            Tactical Graph Intelligence for{" "}
                            <ShimmerText>Organised Crime Cells</ShimmerText>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 text-base leading-relaxed text-surface-500 sm:text-lg"
                        >
                            Autonomous multi-modality evidence ingestion, entity de-duplication, and
                            GNN link prediction. Purpose-built for state police cyber cells to
                            reconstruct syndicate operations while preserving strict evidentiary
                            chain-of-custody.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-10 flex flex-wrap items-center gap-4"
                        >
                            <Link
                                to="/intake"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ember-500 px-6 py-3.5 text-sm font-bold text-surface-900 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] shadow-lg shadow-ember-500/25 transition-all hover:scale-[1.02] hover:bg-ember-400"
                            >
                                <Icon name="upload" size={16} />
                                <span>Ingest Case Evidence</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-surface-300 bg-surface-100/70 px-6 py-3.5 text-sm font-bold text-surface-700 backdrop-blur-sm transition-all hover:bg-surface-200 hover:text-surface-900"
                            >
                                <Icon name="folder" size={16} />
                                <span>View Case History</span>
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-16 lg:mt-0 lg:w-1/2"
                    >
                        <TiltCard max={4} className="rounded-2xl">
                            <div className="glass lit-edge relative rounded-2xl p-2 shadow-2xl">
                                <img
                                    src={dashboardImage}
                                    alt="AstraX tactical dashboard"
                                    className="w-full rounded-xl border border-surface-300 object-cover"
                                />

                                {/* <div className="glass-strong absolute -left-4 top-1/4 hidden items-center gap-2.5 rounded-lg px-3.5 py-2 shadow-2xl sm:flex"> */}
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                    </span>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>
            </section>

            {/* ── Marquee strip ───────────────────────────────────────── */}
            <section className="overflow-hidden border-y border-surface-200/80 bg-surface-50 py-4">
                <div className="relative flex w-full overflow-hidden">
                    <div className="animate-marquee flex items-center whitespace-nowrap py-1 font-mono text-xs font-bold uppercase tracking-wider">
                        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
                            <span key={idx} className="inline-flex shrink-0 items-center">
                                <span className={`mx-2 ${item.color}`}>{item.text}</span>
                                <span className="mx-6 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500/60" />
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Problem section ─────────────────────────────────────── */}
            <section className="bg-surface-0 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <Reveal className="mb-16 max-w-3xl">
                        <Kicker tone="ember">The fragmentation bottleneck</Kicker>
                        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            Modern syndicates operate in data silos
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-surface-500">
                            Organised criminal networks intentionally split communications across
                            disposable VoIP carriers, route payments below statutory reporting
                            thresholds, and hide beneficial ownership behind layered corporate
                            fronts.
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-surface-500">
                            While investigative agencies gather gigabytes of evidence from seized
                            devices, tower pings, and bank statements, manual analysis across
                            unintegrated portals produces investigative paralysis. AstraX bridges
                            this gap by unifying isolated evidence channels into an active,
                            evidence-backed knowledge graph.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────────── */}
            <section className="border-t border-surface-200/80 bg-surface-50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <Reveal className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="font-display text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            A Unified Tactical Analytical Ecosystem
                        </h2>
                        <p className="mt-4 text-base text-surface-500">
                            Engineered for high information density, strict evidentiary provenance,
                            and accelerated prosecutorial briefs.
                        </p>
                    </Reveal>

                    <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <RevealItem key={f.title}>
                                <TiltCard max={4} className="h-full rounded-xl">
                                    <div className="shine-sweep h-full rounded-xl border border-surface-300 bg-surface-100 p-8 shadow-sm transition-all hover:border-ember-500/40 hover:bg-surface-100/90">
                                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-ember-500/30 bg-ember-500/12 text-ember-300">
                                            <Icon name={f.icon} size={22} />
                                        </div>
                                        <h3 className="font-display text-lg font-bold text-surface-900">
                                            {f.title}
                                        </h3>
                                        <p className="mt-3 text-sm leading-relaxed text-surface-500">
                                            {f.desc}
                                        </p>
                                    </div>
                                </TiltCard>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </div>
            </section>

            {/* ── Visual insight section ──────────────────────────────── */}
            <section className="border-t border-surface-200/80 bg-surface-0 py-24">
                <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:w-1/2"
                    >
                        <TiltCard max={4} className="rounded-2xl">
                            <div className="glass overflow-hidden rounded-2xl p-2 shadow-2xl">
                                <img
                                    src={graphImage}
                                    alt="Network graph visualisation"
                                    className="w-full rounded-xl border border-surface-300 object-cover"
                                />
                            </div>
                        </TiltCard>
                    </motion.div>

                    <Reveal className="mt-12 lg:mt-0 lg:w-1/2">
                        <h2 className="font-display text-3xl font-extrabold tracking-tight text-surface-900 sm:text-4xl">
                            Transparent Link Probabilities — Leads, Not Verdicts
                        </h2>
                        <p className="mt-6 text-base leading-relaxed text-surface-500">
                            Every AI-derived prediction in AstraX carries a plain-language qualifier
                            and an interactive source citation. Hypotheses stay visually and
                            structurally distinct from confirmed forensic evidence — always.
                        </p>

                        <div className="mt-8 space-y-3 font-mono text-xs">
                            <div className="flex items-start gap-3 rounded-lg border border-surface-300 bg-surface-100 p-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                                <div>
                                    <strong className="block text-surface-900">
                                        Confirmed evidentiary basis
                                    </strong>
                                    <span className="text-surface-500">
                                        KYC mandates, NAFIS prints, and banking UTR records.
                                    </span>
                                </div>
                            </div>

                            <div className="hypothesis-surface flex items-start gap-3 rounded-lg border border-purple-500/40 bg-purple-500/8 p-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                                <div>
                                    <strong className="block text-purple-300">
                                        Probabilistic GNN hypotheses
                                    </strong>
                                    <span className="text-surface-500">
                                        Unconfirmed links tagged with confidence intervals for
                                        further human inquiry.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <footer className="border-t border-surface-200/80 bg-surface-50 py-12 text-xs text-surface-500">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                    <div className="flex items-center gap-3">
                        <img
                            src="/astrax-logo.png"
                            alt="AstraX"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            className="h-7 w-7 rounded-lg object-contain"
                        />
                        <span className="font-display text-sm font-extrabold tracking-tight text-surface-900">
                            AstraX
                        </span>
                        <span className="font-mono text-[11px] text-surface-500">
                            | Tactical Crime Graph Intelligence
                        </span>
                    </div>

                    <p className="font-mono">
                        Designed for State Police Cyber Crime Cells · Air-Gapped System
                    </p>
                </div>
            </footer>
        </div>
    );
}
