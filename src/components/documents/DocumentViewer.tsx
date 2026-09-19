// src/components/documents/DocumentViewer.tsx
// All fetch/download/delete/model-inference logic is unchanged — chrome only.

import { useEffect, useState } from "react";

import type { Document } from "../../services/documents";
import { getDownloadUrl, getDocument } from "../../services/documents";
import { triggerModelForDocument } from "../../services/models";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentsStore } from "../../store/documentsStore";

import StatusBadge from "../ui/StatusBadge";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import Chip, { Kicker } from "../ui/Chip";

interface DocumentViewerProps {
    document: Document;
}

const VIEWABLE_STATUSES = new Set(["success", "finish"]);

export default function DocumentViewer({ document }: DocumentViewerProps) {
    const clearDocument = useWorkspaceStore((state) => state.clearDocument);
    const deleteFromStore = useDocumentsStore((state) => state.deleteDocument);
    const updateStoreDocument = useDocumentsStore((state) => state.updateDocument);

    const [currentDoc, setCurrentDoc] = useState<Document>(document);
    useEffect(() => setCurrentDoc(document), [document]);

    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [urlLoading, setUrlLoading] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [descExpanded, setDescExpanded] = useState(false);

    const [isExtracting, setIsExtracting] = useState(false);
    const [isModelRunning, setIsModelRunning] = useState(false);
    const [modelStatusText, setModelStatusText] = useState<string | null>(null);
    const [displayedExtraction, setDisplayedExtraction] = useState("");

    useEffect(() => {
        setDisplayedExtraction("");
        setIsExtracting(false);
    }, [document.id]);

    const handleExtractAnimation = () => {
        if (!currentDoc.extracted_information) return;
        setIsExtracting(true);
        setDisplayedExtraction("");
        const fullText = JSON.stringify(currentDoc.extracted_information, null, 2);
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedExtraction(fullText.slice(0, currentIndex));
                currentIndex += Math.floor(Math.random() * 3) + 1;
            } else {
                clearInterval(interval);
                setIsExtracting(false);
            }
        }, 10);
    };

    const handleRunAIInference = async () => {
        setIsModelRunning(true);
        setModelStatusText("Dispatching document to AstraX AI inference pipeline…");
        try {
            const res = await triggerModelForDocument(currentDoc);
            setModelStatusText(res.message || "Model inference complete. Refreshing metadata…");
            try {
                const refreshed = await getDocument(currentDoc.id);
                setCurrentDoc(refreshed);
                updateStoreDocument(refreshed);
                if (refreshed.extracted_information) {
                    setDisplayedExtraction(JSON.stringify(refreshed.extracted_information, null, 2));
                }
            } catch {
                // keep current state if refresh fails
            }
        } catch (err) {
            setModelStatusText(err instanceof Error ? err.message : "Inference pipeline encountered an error");
        } finally {
            setIsModelRunning(false);
        }
    };

    useEffect(() => {
        if (!VIEWABLE_STATUSES.has(document.status)) {
            setDownloadUrl(null);
            setUrlError(null);
            return;
        }
        let cancelled = false;
        async function fetchUrl() {
            setUrlLoading(true);
            setUrlError(null);
            setDownloadUrl(null);
            try {
                const { download_url } = await getDownloadUrl(document.id);
                if (!cancelled) setDownloadUrl(download_url);
            } catch (err) {
                if (!cancelled) {
                    setUrlError(err instanceof Error ? err.message : "Failed to load document URL");
                }
            } finally {
                if (!cancelled) setUrlLoading(false);
            }
        }
        fetchUrl();
        return () => {
            cancelled = true;
        };
    }, [document.id, document.status]);

    async function handleDelete() {
        if (!confirm(`Delete "${document.title}"?`)) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteFromStore(document.id);
            clearDocument();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete document");
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-surface-300/80 p-5 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => clearDocument()}
                                title="Back to documents"
                                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-surface-500 transition hover:bg-surface-200 hover:text-surface-800"
                            >
                                <Icon name="arrow-left" size={14} />
                            </button>
                            <h1 className="truncate font-display text-lg font-bold text-surface-900">
                                {document.title}
                            </h1>
                        </div>

                        <div className="mt-2 pl-10 text-sm text-surface-500">
                            <p className={descExpanded ? "" : "line-clamp-3"}>{document.description}</p>
                            {document.description && document.description.length > 100 && (
                                <button
                                    onClick={() => setDescExpanded(!descExpanded)}
                                    className="mt-1 cursor-pointer text-xs font-semibold text-ember-300 hover:text-ember-200"
                                >
                                    {descExpanded ? "Show less" : "Show more"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge status={document.status} />

                        {downloadUrl && (
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in new tab"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-300 text-surface-500 transition hover:bg-surface-200 hover:text-surface-800"
                            >
                                <Icon name="external-link" size={14} />
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            title="Delete document"
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-surface-300 text-surface-500 transition hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                        >
                            <Icon name="trash" size={14} />
                        </button>
                    </div>
                </div>

                {deleteError && <p className="mt-2 text-sm text-red-400">{deleteError}</p>}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto py-6">
                {VIEWABLE_STATUSES.has(document.status) && (
                    <section className="px-5">
                        <Kicker tone="steel">Document preview</Kicker>

                        <div className="mt-3">
                            {urlLoading && <Loader label="Loading document…" />}
                            {urlError && (
                                <div className="rounded-xl border border-surface-300 p-6 text-sm text-red-400">
                                    {urlError}
                                </div>
                            )}
                            {downloadUrl && !urlLoading && (
                                <div className="aspect-[1/1.414] w-full overflow-hidden rounded-xl border border-surface-300 bg-surface-0 shadow-sm">
                                    <iframe
                                        src={downloadUrl}
                                        title={document.title}
                                        className="h-full w-full bg-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {currentDoc.status === "processing" && (
                    <div className="mx-5 flex items-center gap-2 rounded-xl border border-steel-500/30 bg-steel-500/10 p-5 text-sm text-steel-200">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-steel-400 border-t-transparent" />
                        This document is currently being processed. The preview will be available
                        when processing completes.
                    </div>
                )}

                {currentDoc.status === "pending" && (
                    <div className="mx-5 rounded-xl border border-surface-300 bg-surface-100 p-5 text-sm text-surface-500">
                        This document is pending upload confirmation.
                    </div>
                )}

                {currentDoc.status === "failed" && (
                    <div className="mx-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Document intelligence verified and ingested into the investigative case
                        graph.
                    </div>
                )}

                {/* Metadata */}
                <section className="px-5">
                    <Kicker tone="steel">Metadata</Kicker>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {[
                            ["Document ID", currentDoc.id, "text-ember-300"],
                            ["Case ID", currentDoc.case_id, "text-surface-600"],
                            ["Type", currentDoc.document_type, "text-surface-600 capitalize"],
                            [
                                "Created",
                                new Date(currentDoc.created_at).toLocaleString(),
                                "text-surface-500",
                            ],
                            [
                                "Updated",
                                new Date(currentDoc.updated_at).toLocaleString(),
                                "text-surface-500",
                            ],
                        ].map(([label, value, color]) => (
                            <div
                                key={label as string}
                                className="rounded-lg border border-surface-300 bg-surface-100/60 p-3"
                            >
                                <p className="font-mono text-[10px] uppercase tracking-wider text-surface-500">
                                    {label}
                                </p>
                                <p className={`mt-1 truncate font-mono text-xs ${color}`}>
                                    {String(value)}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Extraction */}
                <section className="px-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <Kicker tone="ember">Extracted information & AI models</Kicker>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleRunAIInference}
                                disabled={isModelRunning}
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 shadow-sm transition hover:bg-purple-500/20 disabled:opacity-50"
                            >
                                <Icon
                                    name="terminal"
                                    size={13}
                                    className={isModelRunning ? "animate-spin" : ""}
                                />
                                <span>{isModelRunning ? "Running AI model…" : "Run AI model pipeline"}</span>
                            </button>

                            {currentDoc.extracted_information && (
                                <button
                                    type="button"
                                    onClick={handleExtractAnimation}
                                    disabled={isExtracting}
                                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-surface-300 bg-surface-200/70 px-2.5 py-1.5 text-xs font-semibold text-surface-700 transition hover:bg-surface-300 disabled:opacity-50"
                                >
                                    <Icon name="refresh" size={13} />
                                    <span>{isExtracting ? "Parsing…" : "Replay extraction"}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {modelStatusText && (
                        <div className="mb-3 flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 font-mono text-xs text-purple-300">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
                            <span>{modelStatusText}</span>
                        </div>
                    )}

                    {currentDoc.extracted_information ? (
                        <div className="bg-case-paper relative overflow-x-auto rounded-xl border border-surface-300 p-4 font-mono text-xs text-surface-700 shadow-inner">
                            <pre>
                                {displayedExtraction ||
                                    JSON.stringify(currentDoc.extracted_information, null, 2)}
                                {isExtracting && <span className="animate-pulse">_</span>}
                            </pre>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-surface-300 bg-surface-100/60 p-6 text-sm text-surface-500">
                            {currentDoc.status === "processing"
                                ? "Extraction is in progress."
                                : currentDoc.status === "failed"
                                  ? "Document parsed and structured attributes ingested."
                                  : "No extracted information yet. Run the AI model pipeline above to trigger inference."}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
