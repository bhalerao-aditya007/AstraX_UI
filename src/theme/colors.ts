// src/theme/colors.ts

/**
 * AstraX "Case File Noir" Semantic Palette
 *
 * Domain Rule (DESIGN.md, unchanged): semantic colours are fixed everywhere and
 * are never repurposed. Only the hues were desaturated to sit inside the warm
 * graphite base — the MEANINGS are identical to the previous palette.
 *
 * Green  = confirmed / evidentiary
 * Red    = high-risk / incident / anomaly
 * Amber  = pattern-alert / pending / warning
 * Ember  = official authority / primary accent  (replaces gold "insignia")
 * Violet = GNN hypothesis / suspected link       (always dashed)
 * Slate  = neutral / unknown / background
 * Steel  = technical / machine / data channel
 */

export const SEMANTIC_COLORS = {
    // Evidentiary & Confirmed
    confirmed: {
        base: "#4e9e75",
        light: "#74be97",
        dark: "#37744f",
        bg: "rgba(78, 158, 117, 0.12)",
        border: "rgba(78, 158, 117, 0.34)",
        text: "#9ed7b8",
    },
    // High Risk & Incident
    risk: {
        base: "#dc5a54",
        light: "#f08a85",
        dark: "#a83b36",
        bg: "rgba(220, 90, 84, 0.12)",
        border: "rgba(220, 90, 84, 0.34)",
        text: "#f4a8a4",
    },
    // Pattern Alert & Pending
    alert: {
        base: "#c4922f",
        light: "#deb05a",
        dark: "#8f6a1f",
        bg: "rgba(196, 146, 47, 0.12)",
        border: "rgba(196, 146, 47, 0.32)",
        text: "#e6c98a",
    },
    // Official Authority / Primary Action  (token name kept: `insignia`)
    insignia: {
        base: "#a85b3a",
        gold: "#c2764f", // legacy key name retained; value is ember, not gold
        light: "#d89873",
        dark: "#7c3f27",
        bg: "rgba(168, 91, 58, 0.14)",
        border: "rgba(168, 91, 58, 0.38)",
        text: "#e7b394",
    },
    // GNN Hypothesis / Predicted Links / Phantom Entities
    hypothesis: {
        base: "#8776d1",
        light: "#a99ce4",
        dark: "#6a58b8",
        bg: "rgba(135, 118, 209, 0.14)",
        border: "rgba(135, 118, 209, 0.45)",
        text: "#c3b9f0",
    },
    // Neutral & Unknown (warm slate)
    neutral: {
        base: "#6e6763",
        light: "#9a928c",
        dark: "#4a4644",
        bg: "rgba(110, 103, 99, 0.14)",
        border: "rgba(110, 103, 99, 0.28)",
        text: "#c4bcb5",
    },
    // Technical / Machine / Data channel
    tech: {
        base: "#5f86aa",
        light: "#85a6c4",
        dark: "#46698b",
        bg: "rgba(95, 134, 170, 0.14)",
        border: "rgba(95, 134, 170, 0.34)",
        text: "#aac6de",
    },
};

/**
 * Graph Entity Node Styling by Domain Theme.
 * `fill` is the CENTRE of a radial gradient, `fillEdge` its rim, `stroke` the
 * crisp outline and `glow` the soft outer halo. The renderer degrades
 * gracefully if `fillEdge` is absent.
 */
export const NODE_THEME_COLORS: Record<
    string,
    Record<string, { fill: string; fillEdge?: string; stroke: string; glow: string }>
> = {
    // Money moves in green — evidentiary value chain
    financial: {
        company: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#8fd0af", glow: "rgba(78,158,117,0.45)" },
        bank_account: { fill: "#57ac80", fillEdge: "#336f51", stroke: "#a4dcc0", glow: "rgba(87,172,128,0.45)" },
        account: { fill: "#57ac80", fillEdge: "#336f51", stroke: "#a4dcc0", glow: "rgba(87,172,128,0.45)" },
        person: { fill: "#74be97", fillEdge: "#3f8964", stroke: "#c3e9d5", glow: "rgba(116,190,151,0.45)" },
        phone: { fill: "#46906a", fillEdge: "#2a5f46", stroke: "#8fd0af", glow: "rgba(70,144,106,0.4)" },
        wallet: { fill: "#3d8360", fillEdge: "#255440", stroke: "#7cc6a2", glow: "rgba(61,131,96,0.4)" },
        device: { fill: "#8ecfad", fillEdge: "#4e9e75", stroke: "#d6f0e3", glow: "rgba(142,207,173,0.4)" },
        evidence: { fill: "#c4922f", fillEdge: "#8f6a1f", stroke: "#e6c98a", glow: "rgba(196,146,47,0.4)" },
        phantom: { fill: "#2a2440", fillEdge: "#1b1830", stroke: "#8776d1", glow: "rgba(135,118,209,0.45)" },
        default: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
    },
    // Machines and networks in steel
    digital: {
        company: { fill: "#46698b", fillEdge: "#2a4157", stroke: "#9dbdd6", glow: "rgba(70,105,139,0.45)" },
        bank_account: { fill: "#5f86aa", fillEdge: "#37536d", stroke: "#b3cde0", glow: "rgba(95,134,170,0.45)" },
        account: { fill: "#5f86aa", fillEdge: "#37536d", stroke: "#b3cde0", glow: "rgba(95,134,170,0.45)" },
        person: { fill: "#c2764f", fillEdge: "#7c3f27", stroke: "#eab99c", glow: "rgba(194,118,79,0.45)" },
        phone: { fill: "#6d95b8", fillEdge: "#3f6182", stroke: "#bcd5e6", glow: "rgba(109,149,184,0.45)" },
        ip: { fill: "#46698b", fillEdge: "#2a4157", stroke: "#9dbdd6", glow: "rgba(70,105,139,0.45)" },
        server: { fill: "#3f6182", fillEdge: "#243c52", stroke: "#9dbdd6", glow: "rgba(63,97,130,0.45)" },
        wallet: { fill: "#35526e", fillEdge: "#1f3247", stroke: "#85a6c4", glow: "rgba(53,82,110,0.4)" },
        device: { fill: "#85a6c4", fillEdge: "#46698b", stroke: "#d2e2ee", glow: "rgba(133,166,196,0.4)" },
        evidence: { fill: "#c4922f", fillEdge: "#8f6a1f", stroke: "#e6c98a", glow: "rgba(196,146,47,0.4)" },
        location: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
        phantom: { fill: "#2a2440", fillEdge: "#1b1830", stroke: "#8776d1", glow: "rgba(135,118,209,0.45)" },
        default: { fill: "#5f86aa", fillEdge: "#35526e", stroke: "#b3cde0", glow: "rgba(95,134,170,0.4)" },
    },
    // Voice / messaging traffic in violet-leaning indigo (distinct from hypothesis violet by saturation)
    communication: {
        company: { fill: "#6a58b8", fillEdge: "#3f356e", stroke: "#b6abe8", glow: "rgba(106,88,184,0.45)" },
        bank_account: { fill: "#8776d1", fillEdge: "#4f4488", stroke: "#c3b9f0", glow: "rgba(135,118,209,0.45)" },
        person: { fill: "#c2764f", fillEdge: "#7c3f27", stroke: "#eab99c", glow: "rgba(194,118,79,0.45)" },
        phone: { fill: "#7a68c6", fillEdge: "#473c7c", stroke: "#bdb2ec", glow: "rgba(122,104,198,0.45)" },
        cell_tower: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
        virtual_service: { fill: "#5f86aa", fillEdge: "#35526e", stroke: "#b3cde0", glow: "rgba(95,134,170,0.4)" },
        wallet: { fill: "#4f4488", fillEdge: "#2f2857", stroke: "#a99ce4", glow: "rgba(79,68,136,0.4)" },
        device: { fill: "#a99ce4", fillEdge: "#6a58b8", stroke: "#ded8f8", glow: "rgba(169,156,228,0.4)" },
        location: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
        evidence: { fill: "#c4922f", fillEdge: "#8f6a1f", stroke: "#e6c98a", glow: "rgba(196,146,47,0.4)" },
        phantom: { fill: "#2a2440", fillEdge: "#1b1830", stroke: "#8776d1", glow: "rgba(135,118,209,0.45)" },
        default: { fill: "#8776d1", fillEdge: "#4f4488", stroke: "#c3b9f0", glow: "rgba(135,118,209,0.4)" },
    },
    // Seized physical material in ember / ochre — the "evidence tag" family
    evidence: {
        company: { fill: "#a85b3a", fillEdge: "#6a3624", stroke: "#e7b394", glow: "rgba(168,91,58,0.45)" },
        bank_account: { fill: "#c4922f", fillEdge: "#8f6a1f", stroke: "#e6c98a", glow: "rgba(196,146,47,0.45)" },
        person: { fill: "#c2764f", fillEdge: "#7c3f27", stroke: "#eab99c", glow: "rgba(194,118,79,0.45)" },
        phone: { fill: "#8f6a1f", fillEdge: "#5b4415", stroke: "#deb05a", glow: "rgba(143,106,31,0.4)" },
        physical_evidence: { fill: "#a85b3a", fillEdge: "#6a3624", stroke: "#e7b394", glow: "rgba(168,91,58,0.45)" },
        forensic_report: { fill: "#8776d1", fillEdge: "#4f4488", stroke: "#c3b9f0", glow: "rgba(135,118,209,0.4)" },
        digital_forensic: { fill: "#5f86aa", fillEdge: "#35526e", stroke: "#b3cde0", glow: "rgba(95,134,170,0.4)" },
        biometric_proof: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
        wallet: { fill: "#7c3f27", fillEdge: "#4c2718", stroke: "#c2764f", glow: "rgba(124,63,39,0.4)" },
        device: { fill: "#deb05a", fillEdge: "#8f6a1f", stroke: "#f2ddb3", glow: "rgba(222,176,90,0.4)" },
        vehicle: { fill: "#6e6763", fillEdge: "#4a4644", stroke: "#c4bcb5", glow: "rgba(110,103,99,0.4)" },
        phantom: { fill: "#2a2440", fillEdge: "#1b1830", stroke: "#8776d1", glow: "rgba(135,118,209,0.45)" },
        default: { fill: "#c4922f", fillEdge: "#8f6a1f", stroke: "#e6c98a", glow: "rgba(196,146,47,0.4)" },
    },
    default: {
        company: { fill: "#c4922f", fillEdge: "#8f6a1f", stroke: "#e6c98a", glow: "rgba(196,146,47,0.4)" },
        bank_account: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
        account: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
        person: { fill: "#c2764f", fillEdge: "#7c3f27", stroke: "#eab99c", glow: "rgba(194,118,79,0.45)" },
        suspect: { fill: "#dc5a54", fillEdge: "#8c322e", stroke: "#f4a8a4", glow: "rgba(220,90,84,0.45)" },
        officer: { fill: "#5f86aa", fillEdge: "#35526e", stroke: "#b3cde0", glow: "rgba(95,134,170,0.4)" },
        phone: { fill: "#8776d1", fillEdge: "#4f4488", stroke: "#c3b9f0", glow: "rgba(135,118,209,0.4)" },
        wallet: { fill: "#a85b3a", fillEdge: "#6a3624", stroke: "#e7b394", glow: "rgba(168,91,58,0.4)" },
        device: { fill: "#6e6763", fillEdge: "#4a4644", stroke: "#c4bcb5", glow: "rgba(110,103,99,0.4)" },
        vehicle: { fill: "#8776d1", fillEdge: "#4f4488", stroke: "#c3b9f0", glow: "rgba(135,118,209,0.4)" },
        location: { fill: "#4e9e75", fillEdge: "#2f6b4d", stroke: "#9ed7b8", glow: "rgba(78,158,117,0.4)" },
        evidence: { fill: "#c4922f", fillEdge: "#8f6a1f", stroke: "#e6c98a", glow: "rgba(196,146,47,0.4)" },
        weapon: { fill: "#dc5a54", fillEdge: "#8c322e", stroke: "#f4a8a4", glow: "rgba(220,90,84,0.45)" },
        phantom: { fill: "#2a2440", fillEdge: "#1b1830", stroke: "#8776d1", glow: "rgba(135,118,209,0.45)" },
        default: { fill: "#6e6763", fillEdge: "#403b38", stroke: "#c4bcb5", glow: "rgba(110,103,99,0.35)" },
    },
};

/** Edge colour language — confirmed vs. hypothesis is a hard visual contract. */
export const EDGE_COLORS = {
    confirmed: "#7b736e",
    confirmedActive: "#c2764f",
    hypothesis: "#8776d1",
    hypothesisParticle: "#c3b9f0",
    particle: "#85a6c4",
    labelBg: "rgba(20,19,18,0.92)",
    labelBorder: "rgba(48,45,43,0.9)",
    labelText: "#9a928c",
};
