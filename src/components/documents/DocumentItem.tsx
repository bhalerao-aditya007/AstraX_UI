// src/components/documents/DocumentItem.tsx
// Store usage and delete flow unchanged.

import type { Document } from "../../services/documents";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentsStore } from "../../store/documentsStore";
import StatusBadge from "../ui/StatusBadge";
import Icon, { type IconName } from "../ui/Icon";

interface DocumentItemProps {
    document: Document;
}

const TYPE_ICON: Record<string, IconName> = {
    image: "image-bio",
    voice: "audio-mic",
    video: "video-cctv",
    text: "file-text",
};

export default function DocumentItem({ document }: DocumentItemProps) {
    const selectedDocumentId = useWorkspaceStore((state) => state.selectedDocumentId);
    const selectDocument = useWorkspaceStore((state) => state.selectDocument);
    const clearDocument = useWorkspaceStore((state) => state.clearDocument);
    const deleteDocument = useDocumentsStore((state) => state.deleteDocument);

    const isSelected = selectedDocumentId === document.id;

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm(`Delete "${document.title}"?`)) return;
        try {
            if (isSelected) clearDocument();
            await deleteDocument(document.id);
        } catch {
            // handled silently
        }
    }

    return (
        <div
            onClick={() => selectDocument(document.id)}
            className={`group relative cursor-pointer rounded-xl border p-4 transition-all ${
                isSelected
                    ? "tag-spine border-ember-500/40 bg-ember-500/8"
                    : "border-surface-300 bg-surface-100/60 hover:border-surface-400 hover:bg-surface-200/40"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-surface-300 bg-surface-200/70 text-surface-500">
                        <Icon name={TYPE_ICON[document.document_type] || "file-text"} size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-surface-900">
                            {document.title}
                        </h3>
                        <p className="mt-1 truncate text-xs text-surface-500">
                            {document.description}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={document.status} />
                    <button
                        type="button"
                        onClick={handleDelete}
                        title="Delete document"
                        className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded text-surface-500 transition hover:bg-red-500/15 hover:text-red-400 ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                    >
                        <Icon name="trash" size={12} />
                    </button>
                </div>
            </div>

            <div className="mt-2.5 flex items-center gap-3 font-mono text-[11px] text-surface-500">
                <span className="capitalize">{document.document_type}</span>
                <span className="opacity-40">·</span>
                <span>{new Date(document.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
