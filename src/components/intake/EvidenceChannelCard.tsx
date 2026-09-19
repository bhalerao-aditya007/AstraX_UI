// src/components/intake/EvidenceChannelCard.tsx
// Props and file-reading logic unchanged — chrome + the document viewer
// modal were rebuilt to match the rest of the system.

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon, { type IconName } from "../ui/Icon";
import Chip, { Kicker } from "../ui/Chip";

export interface ChannelFile {
    id: string;
    file: File;
    name: string;
    size: number;
    status: "queued" | "parsing" | "extracted" | "failed";
    progress: number;
    extractedSnippet?: string;
}

export interface ChannelConfig {
    id: string;
    title: string;
    icon: IconName;
    accepts: string;
    acceptsLabel: string;
    pipelineNote: string;
    limits: string;
}

interface EvidenceChannelCardProps {
    config: ChannelConfig;
    files: ChannelFile[];
    onFilesAdded: (channelId: string, newFiles: File[]) => void;
    onFileRemoved: (channelId: string, fileId: string) => void;
}

export default function EvidenceChannelCard({
    config,
    files,
    onFilesAdded,
    onFileRemoved,
}: EvidenceChannelCardProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const hasFiles = files.length > 0;

    const [viewingFile, setViewingFile] = useState<ChannelFile | null>(null);
    const [viewContent, setViewContent] = useState<string>("");
    const [isLoadingContent, setIsLoadingContent] = useState(false);

    const handleViewFile = async (fileItem: ChannelFile) => {
        setViewingFile(fileItem);
        setIsLoadingContent(true);
        try {
            const text = await fileItem.file.text();
            setViewContent(text);
        } catch {
            setViewContent("[Unable to read file content]");
        } finally {
            setIsLoadingContent(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesAdded(config.id, Array.from(e.dataTransfer.files));
        }
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <div
                className={`shine-sweep flex flex-col overflow-hidden rounded-xl border transition-all duration-200 ${
                    hasFiles
                        ? "tag-spine border-ember-500/40 bg-surface-100/90"
                        : "border-surface-300 bg-surface-50/60 hover:border-surface-400"
                }`}
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-surface-300/70 p-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                                hasFiles
                                    ? "border-ember-500/40 bg-ember-500/12 text-ember-300"
                                    : "border-surface-300 bg-surface-200 text-surface-500"
                            }`}
                        >
                            <Icon name={config.icon} size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold tracking-tight text-surface-900">
                                {config.title}
                            </h3>
                            <p className="mt-0.5 font-mono text-[11px] text-surface-500">
                                {config.acceptsLabel}
                            </p>
                        </div>
                    </div>

                    {hasFiles ? (
                        <Chip tone="ember" size="xs">
                            {files.length} {files.length === 1 ? "file" : "files"}
                        </Chip>
                    ) : (
                        <Chip tone="neutral" size="xs">
                            not provided
                        </Chip>
                    )}
                </div>

                {/* Pipeline note */}
                <div className="flex items-start gap-2 border-b border-surface-300/50 bg-surface-200/30 px-4 py-2 text-[11px] text-surface-600">
                    <Icon name="radar" size={12} className="mt-0.5 shrink-0 text-ember-300" />
                    <span className="leading-tight">{config.pipelineNote}</span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => inputRef.current?.click()}
                        className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-surface-400/80 bg-surface-0/50 px-3 py-5 text-center transition-colors hover:border-ember-500/60 hover:bg-ember-500/5"
                    >
                        <Icon
                            name="upload"
                            size={20}
                            className="mb-1.5 text-surface-500 transition-colors group-hover:text-ember-300"
                        />
                        <p className="text-xs font-semibold text-surface-700 group-hover:text-surface-900">
                            Drag & drop files or{" "}
                            <span className="text-ember-300 underline">browse</span>
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-surface-500">
                            {config.limits}
                        </p>
                    </div>

                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept={config.accepts}
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                onFilesAdded(config.id, Array.from(e.target.files));
                            }
                        }}
                        className="hidden"
                    />

                    {hasFiles && (
                        <div className="mt-1 max-h-36 space-y-2 overflow-y-auto pr-1">
                            {files.map((fileItem) => (
                                <div
                                    key={fileItem.id}
                                    onClick={() => handleViewFile(fileItem)}
                                    title="Click to inspect document content"
                                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-surface-300 bg-surface-0/70 px-2.5 py-1.5 font-mono text-xs transition-all hover:border-ember-500/50 hover:bg-surface-200/50"
                                >
                                    <div className="min-w-0 flex-1 pr-2">
                                        <div className="truncate font-medium text-surface-800">
                                            {fileItem.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-surface-500">
                                            <span>{(fileItem.size / 1024).toFixed(1)} KB</span>
                                            <span>·</span>
                                            <span className="font-semibold uppercase text-emerald-400">
                                                {fileItem.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewFile(fileItem);
                                            }}
                                            className="cursor-pointer p-1 text-surface-500 transition-colors hover:text-ember-300"
                                            title="View document content"
                                        >
                                            <Icon name="file-text" size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onFileRemoved(config.id, fileItem.id);
                                            }}
                                            className="cursor-pointer p-1 text-surface-500 transition-colors hover:text-red-400"
                                            title="Remove file"
                                        >
                                            <Icon name="cross" size={13} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content viewer */}
            <AnimatePresence>
                {viewingFile && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        onClick={() => {
                            setViewingFile(null);
                            setViewContent("");
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface-0/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-strong relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-surface-300/80 px-5 py-3.5">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ember-500/35 bg-ember-500/12 text-ember-300">
                                        <Icon name={config.icon} size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-bold text-surface-900">
                                            {viewingFile.name}
                                        </h3>
                                        <p className="font-mono text-[10px] text-surface-500">
                                            {(viewingFile.size / 1024).toFixed(1)} KB · {config.title} ·{" "}
                                            {viewingFile.status.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setViewingFile(null);
                                        setViewContent("");
                                    }}
                                    className="cursor-pointer rounded-lg border border-surface-300 bg-surface-200/70 p-1.5 text-surface-500 transition-colors hover:text-surface-900"
                                >
                                    <Icon name="cross" size={14} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5">
                                {isLoadingContent ? (
                                    <div className="flex items-center justify-center py-12">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-ember-400 border-t-transparent" />
                                        <span className="ml-3 font-mono text-sm text-surface-500">
                                            Loading document content…
                                        </span>
                                    </div>
                                ) : (
                                    <pre className="bg-case-paper whitespace-pre-wrap break-words rounded-xl border border-surface-300/70 p-4 font-mono text-xs leading-relaxed text-surface-700">
                                        {viewContent || "[No content available]"}
                                    </pre>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
