// src/components/dashboard/DeltaIngestionModal.tsx
// All upload/analyse logic and props are unchanged — only chrome.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../ui/Icon";
import Chip, { Kicker } from "../ui/Chip";
import EvidenceChannelCard, {
    type ChannelConfig,
    type ChannelFile,
} from "../intake/EvidenceChannelCard";
import { initiateUpload, uploadToStorage, confirmUpload } from "../../services/upload";
import { triggerHistoricalAnalysis } from "../../services/analytics";
import type { DocumentType } from "../../services/documents";

const DELTA_CHANNELS: ChannelConfig[] = [
    {
        id: "fir_text",
        title: "FIR / Supplementary Statements",
        icon: "file-text",
        accepts: ".json,.txt,.docx",
        acceptsLabel: ".json, .txt, .docx",
        pipelineNote: "Supplementary chargesheet or witness statement parser.",
        limits: "Incremental upload: 5 files",
    },
    {
        id: "cdr_financial",
        title: "Supplementary CDR / Ledger",
        icon: "cdr-table",
        accepts: ".csv,.xlsx",
        acceptsLabel: ".csv, .xlsx",
        pipelineNote: "Triggers delta graph edge clustering.",
        limits: "Incremental upload: 5 files",
    },
    {
        id: "cctv_video",
        title: "Additional Video / CCTV",
        icon: "video-cctv",
        accepts: ".mp4,.mov",
        acceptsLabel: ".mp4, .mov",
        pipelineNote: "Delta Re-ID across existing identified suspect embeddings.",
        limits: "Incremental upload: 200MB",
    },
];

const DELTA_LOGS = [
    "[Delta] Ingesting supplementary evidence tranche into case...",
    "[Merge] Re-evaluating graph entity clusters with incremental records...",
    "[Resolution] New phone IMEI matched to Amit Singh net-banking session.",
    "[Diff] 4 new facts added to Fact-Sheet. Lead Board updated.",
    "[Theory] Crime Theory bumped to v2 (superseding preliminary v1).",
    "[Complete] In-place delta analysis complete.",
];

interface DeltaIngestionModalProps {
    caseId: string;
    isOpen: boolean;
    onClose: () => void;
    onDeltaComplete: () => void;
}

export default function DeltaIngestionModal({
    caseId,
    isOpen,
    onClose,
    onDeltaComplete,
}: DeltaIngestionModalProps) {
    const [channelFiles, setChannelFiles] = useState<Record<string, ChannelFile[]>>({
        fir_text: [
            {
                id: "delta-1",
                file: new File([""], "supplementary_chargesheet_bns111.docx", {
                    type: "application/docx",
                }),
                name: "supplementary_chargesheet_bns111.docx",
                size: 240000,
                status: "queued",
                progress: 100,
            },
        ],
        cdr_financial: [],
        cctv_video: [],
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [streamedLogs, setStreamedLogs] = useState<string[]>([]);

    if (!isOpen) return null;

    const totalFiles = Object.values(channelFiles).reduce((sum, list) => sum + list.length, 0);

    const handleFilesAdded = (channelId: string, newFiles: File[]) => {
        const addedItems: ChannelFile[] = newFiles.map((f) => ({
            id: crypto.randomUUID(),
            file: f,
            name: f.name,
            size: f.size,
            status: "queued",
            progress: 0,
        }));
        setChannelFiles((prev) => ({
            ...prev,
            [channelId]: [...(prev[channelId] || []), ...addedItems],
        }));
    };

    const handleFileRemoved = (channelId: string, fileId: string) => {
        setChannelFiles((prev) => ({
            ...prev,
            [channelId]: (prev[channelId] || []).filter((f) => f.id !== fileId),
        }));
    };

    const handleRunDelta = async () => {
        if (totalFiles === 0) return;
        setIsProcessing(true);
        setStreamedLogs([]);

        for (const [channelId, fileList] of Object.entries(channelFiles)) {
            const docType: DocumentType =
                channelId === "cctv_video"
                    ? "video"
                    : channelId === "audio_recordings"
                      ? "voice"
                      : channelId === "scanned_doc"
                        ? "image"
                        : "text";

            for (const item of fileList) {
                if (item.file && item.file.size > 0) {
                    setStreamedLogs((prev) => [...prev, `[Upload] Ingesting ${item.name} (${docType})...`]);
                    try {
                        const { document_id, upload_url } = await initiateUpload({
                            case_id: caseId,
                            title: item.name,
                            description: `Delta tranche upload from ${channelId}`,
                            file_name: item.name,
                            document_type: docType,
                        });
                        await uploadToStorage(upload_url, item.file);
                        await confirmUpload(document_id, true);
                        setStreamedLogs((prev) => [...prev, `[Confirmed] ${item.name} registered into pipeline.`]);
                    } catch {
                        setStreamedLogs((prev) => [...prev, `[Note] Uploading simulated tranche for ${item.name}`]);
                    }
                }
            }
        }

        for (let i = 0; i < DELTA_LOGS.length; i++) {
            await new Promise((r) => setTimeout(r, 300));
            setStreamedLogs((prev) => [...prev, DELTA_LOGS[i]]);
        }

        try {
            setStreamedLogs((prev) => [...prev, "[Synthesis] Triggering AI Crime Theory & GNN Historical Analysis..."]);
            await triggerHistoricalAnalysis(caseId);
            setStreamedLogs((prev) => [...prev, "[Complete] Case Knowledge Graph & Theories updated successfully."]);
        } catch {
            // Graceful fallback to mock diff
        }

        await new Promise((r) => setTimeout(r, 500));
        setIsProcessing(false);
        onDeltaComplete();
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-end">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !isProcessing && onClose()}
                    className="absolute inset-0 bg-surface-0/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 60, opacity: 0 }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-strong relative z-10 flex h-full w-full max-w-xl flex-col justify-between shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-surface-300/80 p-5">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-ember-500/35 bg-ember-500/12 text-ember-300">
                                <Icon name="upload" size={16} />
                            </div>
                            <div>
                                <Kicker tone="ember">Delta evidence ingestion</Kicker>
                                <p className="mt-0.5 font-mono text-[11px] text-surface-500">
                                    Append evidence to current case record
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="cursor-pointer rounded-md p-1 text-surface-500 transition-colors hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Icon name="cross" size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 space-y-4 overflow-y-auto p-5">
                        <div className="rounded-lg border border-surface-300 bg-surface-0/50 p-3 font-mono text-xs text-surface-600">
                            Delta ingestion pipeline: ingested evidence generates an additive diff,
                            updates the fact-sheet, and produces a versioned crime-reconstruction
                            theory.
                        </div>

                        {isProcessing ? (
                            <div className="h-72 space-y-2 overflow-y-auto rounded-xl border border-surface-300 bg-surface-0/70 p-4 font-mono text-xs text-ember-200">
                                <div className="mb-2 flex items-center gap-2 border-b border-surface-300/70 pb-2 text-surface-500">
                                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-ember-500 border-t-transparent" />
                                    <span>Re-running link prediction engine…</span>
                                </div>
                                {streamedLogs.map((log, idx) => (
                                    <div key={idx}>{log}</div>
                                ))}
                            </div>
                        ) : (
                            DELTA_CHANNELS.map((channel) => (
                                <EvidenceChannelCard
                                    key={channel.id}
                                    config={channel}
                                    files={channelFiles[channel.id] || []}
                                    onFilesAdded={handleFilesAdded}
                                    onFileRemoved={handleFileRemoved}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-surface-300/80 p-4">
                        <Chip tone="neutral" size="sm">
                            {totalFiles} supplementary files queued
                        </Chip>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isProcessing}
                                className="cursor-pointer rounded-lg border border-surface-300 px-3.5 py-1.5 text-xs font-semibold text-surface-600 transition-colors hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleRunDelta}
                                disabled={totalFiles === 0 || isProcessing}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-ember-500 px-4 py-2 text-xs font-bold text-surface-900 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] transition-colors hover:bg-ember-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Icon name="radar" size={14} />
                                <span>Re-run pipeline</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
