// src/components/cases/CaseItem.tsx
// Props unchanged. Reads as a physical case tab: ember spine when active,
// mono case id, track glyph, quiet actions that only surface on hover.

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWorkspaceStore } from "../../store/workspaceStore";
import type { Case } from "../../services/cases";
import Icon from "../ui/Icon";

interface CaseItemProps {
    caseItem: Case;
    onEdit: (caseItem: Case) => void;
    onDelete: (caseItem: Case) => void;
}

export default function CaseItem({ caseItem, onEdit, onDelete }: CaseItemProps) {
    const selectedCaseId = useWorkspaceStore((state) => state.selectedCaseId);
    const selectCase = useWorkspaceStore((state) => state.selectCase);
    const navigate = useNavigate();

    const isSelected = selectedCaseId === caseItem.id;
    const isTrack2 = (caseItem.track ?? 2) === 2;

    return (
        <div
            onClick={() => selectCase(caseItem.id)}
            className={`group relative flex cursor-pointer items-center rounded-lg border px-3 py-2.5 text-xs transition-all ${
                isSelected
                    ? "tag-spine border-ember-500/35 bg-ember-500/10"
                    : "border-transparent hover:border-surface-300 hover:bg-surface-200/50"
            }`}
        >
            {isSelected && (
                <motion.span
                    layoutId="case-active-glow"
                    className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-ember-500/20"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
            )}

            <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${
                    isSelected
                        ? "border-ember-500/40 bg-ember-500/15 text-ember-300"
                        : "border-surface-300 bg-surface-200 text-surface-500"
                }`}
            >
                <Icon name={isTrack2 ? "network-graph" : "scale-justice"} size={13} />
            </div>

            <div className="ml-2.5 min-w-0 flex-1">
                <div
                    className={`truncate font-medium ${
                        isSelected ? "text-surface-900" : "text-surface-700 group-hover:text-surface-900"
                    }`}
                >
                    {caseItem.name}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-surface-500">
                    <span className={isTrack2 ? "text-ember-300/90" : "text-surface-500"}>
                        TRACK {caseItem.track ?? 2}
                    </span>
                    <span className="opacity-40">/</span>
                    <span>{new Date(caseItem.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div
                className={`flex shrink-0 items-center gap-0.5 transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
            >
                <button
                    type="button"
                    title="Open case analysis workspace"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cases/${caseItem.id}`);
                    }}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-ember-300 transition-colors hover:bg-ember-500/20"
                >
                    <Icon name="external-link" size={12} />
                </button>
                <button
                    type="button"
                    title="Rename case"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(caseItem);
                    }}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-800"
                >
                    <Icon name="edit" size={12} />
                </button>
                <button
                    type="button"
                    title="Delete case"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(caseItem);
                    }}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-surface-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                >
                    <Icon name="trash" size={12} />
                </button>
            </div>
        </div>
    );
}
