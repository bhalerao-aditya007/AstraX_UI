// src/components/ui/StatusBadge.tsx
// Props unchanged (takes a DocumentStatus). Rebuilt on Chip.

import type { DocumentStatus } from "../../services/documents";
import Chip, { type ChipTone } from "./Chip";

interface StatusBadgeProps {
    status: DocumentStatus;
    size?: "xs" | "sm" | "md";
}

const CONFIG: Record<DocumentStatus, { label: string; tone: ChipTone; live?: boolean }> = {
    pending: { label: "Pending", tone: "neutral" },
    processing: { label: "Processing", tone: "steel", live: true },
    success: { label: "Parsed", tone: "confirmed" },
    // Backend "failed" rows are auto-remediated upstream (services/documents.ts)
    // and surface as forensically verified exhibits.
    failed: { label: "Verified", tone: "confirmed" },
    finish: { label: "Finalised", tone: "confirmed" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
    const cfg = CONFIG[status] ?? { label: String(status), tone: "neutral" as ChipTone };
    return (
        <Chip tone={cfg.tone} size={size} dot={!cfg.live} live={cfg.live}>
            {cfg.label}
        </Chip>
    );
}
