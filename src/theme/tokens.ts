// src/theme/tokens.ts

/**
 * AstraX "Case File Noir" Theme Tokens
 *
 * Base surfaces: warm graphite — a dimly lit records room, never pure black.
 * Primary accent: ember (muted rust / terracotta) — evidence tags, redaction
 *                 stamps, aged case-file folders. Authority without gold.
 * Secondary:     steel (cool slate-blue) — technical / data / machine output.
 *
 * Rule: ember is chrome + authority. steel is data + machine.
 * Semantic colours (confirmed / risk / alert / hypothesis) are NEVER used as
 * chrome and NEVER repurposed — see DESIGN.md.
 */
export const THEME_TOKENS = {
    surfaces: {
        0: "#0E0D0C",    // darkest canvas / body background (warm near-black)
        50: "#141312",   // base panel background
        100: "#1A1817",  // card / container background
        200: "#232120",  // elevated card / secondary container
        300: "#302D2B",  // subtle borders & dividers
        400: "#4A4644",  // stronger borders & disabled text
        500: "#6E6763",  // muted / secondary text
        600: "#9A928C",  // body text / standard labels
        700: "#C4BCB5",  // bright text / high-contrast labels
        800: "#E3DCD5",  // prominent headings
        900: "#F6F2ED",  // near-white primary text / highlights
    },
    accents: {
        // Primary authority accent (replaces the banned gold "insignia")
        ember: "#A85B3A",
        emberHover: "#C2764F",
        emberSoft: "#D89873",
        // Technical / informational channel
        steel: "#5F86AA",
        steelHover: "#85A6C4",
    },
    semantic: {
        confirmed: "#4E9E75",   // evidentiary / locked in
        risk: "#DC5A54",        // high risk / incident
        alert: "#C4922F",       // pattern alert / pending
        hypothesis: "#8776D1",  // GNN hypothesis / predicted (always dashed)
        neutral: "#6E6763",     // unknown
    },
    fonts: {
        sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "'Ranade', 'Inter', system-ui, -apple-system, sans-serif",
        mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
    radii: {
        sm: "0.375rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1.125rem",
        full: "9999px",
    },
    /** Elevation is light + border, never heavy drop shadows. */
    elevation: {
        flat: "none",
        raised: "0 1px 0 0 rgba(246,242,237,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.75)",
        floating: "0 1px 0 0 rgba(246,242,237,0.06) inset, 0 24px 60px -24px rgba(0,0,0,0.85)",
    },
    motion: {
        /** shared easing: "settles like a file placed on a desk" */
        settle: [0.16, 1, 0.3, 1] as [number, number, number, number],
        snap: [0.2, 0.9, 0.2, 1] as [number, number, number, number],
        durations: { fast: 0.18, base: 0.34, slow: 0.55, ambient: 1.2 },
    },
};
