// src/components/upload/UploadProgress.tsx
// Stage machine, props, and thresholds unchanged.

import type { Document } from "../../services/documents";
import Icon from "../ui/Icon";
import Button from "../ui/Button";

type UploadStage =
    | "idle"
    | "initiating"
    | "uploading"
    | "confirming"
    | "processing"
    | "done"
    | "error";

interface UploadProgressProps {
    stage: UploadStage;
    document: Document | null;
    error: string | null;
    onDone: () => void;
}

const stageLabels: Record<UploadStage, string> = {
    idle: "",
    initiating: "Preparing upload…",
    uploading: "Uploading file…",
    confirming: "Confirming upload…",
    processing: "Processing document…",
    done: "Upload complete",
    error: "Upload failed",
};

const stageOrder: UploadStage[] = ["initiating", "uploading", "confirming", "processing", "done"];

export default function UploadProgress({ stage, document, error, onDone }: UploadProgressProps) {
    if (stage === "idle") return null;

    const currentIndex = stageOrder.indexOf(stage);

    return (
        <div className="mt-4 rounded-lg border border-surface-300 bg-surface-200/40 p-4">
            <div className="mb-4 flex items-center gap-2">
                {stageOrder.map((s, i) => {
                    const isDone = i < currentIndex || stage === "done";
                    const isCurrent = s === stage;
                    const isError = stage === "error" && i === currentIndex;

                    return (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${
                                    isError
                                        ? "bg-red-500 text-surface-900"
                                        : isDone
                                          ? "bg-emerald-500 text-surface-900"
                                          : isCurrent
                                            ? "border-2 border-ember-400 bg-transparent text-ember-300"
                                            : "border border-surface-400 bg-transparent text-surface-500"
                                }`}
                            >
                                {isDone ? "✓" : i + 1}
                            </div>
                            {i < stageOrder.length - 1 && (
                                <div
                                    className={`h-px w-4 ${
                                        isDone ? "bg-emerald-500/50" : "bg-surface-400/40"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <p
                className={`font-mono text-xs ${
                    stage === "error"
                        ? "text-red-400"
                        : stage === "done"
                          ? "text-emerald-400"
                          : "text-surface-200"
                }`}
            >
                {stage === "error" && error ? error : stageLabels[stage]}
            </p>

            {stage !== "done" && stage !== "error" && (
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-surface-300 border-t-ember-400" />
                    <span className="font-mono text-xs text-surface-500">Processing stream…</span>
                </div>
            )}

            {stage === "done" && document && (
                <div className="mt-3">
                    <p className="font-mono text-xs text-surface-500">
                        <span className="font-semibold text-surface-200">{document.title}</span>{" "}
                        ingested into evidentiary archive. Status:{" "}
                        <span className="font-semibold uppercase text-emerald-400">
                            {document.status}
                        </span>
                    </p>
                    <Button size="sm" className="mt-3" onClick={onDone}>
                        <Icon name="check-circle" size={13} />
                        Acknowledge
                    </Button>
                </div>
            )}
        </div>
    );
}
