// src/components/upload/UploadDocument.tsx
// Upload flow, stages and service calls unchanged — chrome rebuilt on Modal.

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { initiateUpload, uploadToStorage, confirmUpload } from "../../services/upload";
import type { Document, DocumentType } from "../../services/documents";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import UploadProgress from "./UploadProgress";

type UploadStage =
    | "idle"
    | "initiating"
    | "uploading"
    | "confirming"
    | "processing"
    | "done"
    | "error";

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
    { value: "image", label: "Image (FIR / TrOCR / ANPR)" },
    { value: "text", label: "Text / Ledger (CSV / Report)" },
    { value: "voice", label: "Voice / Wiretap (ASR)" },
    { value: "video", label: "CCTV Video (YOLO Detection)" },
];

interface UploadDocumentProps {
    caseId: string;
    onUploaded: (document: Document) => void;
    onClose: () => void;
}

export default function UploadDocument({ caseId, onUploaded, onClose }: UploadDocumentProps) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [documentType, setDocumentType] = useState<DocumentType>("text");
    const [file, setFile] = useState<File | null>(null);

    const [stage, setStage] = useState<UploadStage>("idle");
    const [uploadedDoc, setUploadedDoc] = useState<Document | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUploading = stage !== "idle" && stage !== "done" && stage !== "error";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file || !title.trim()) return;
        setError(null);

        try {
            setStage("initiating");
            const { document_id, upload_url } = await initiateUpload({
                case_id: caseId,
                title: title.trim(),
                description: description.trim(),
                file_name: file.name,
                document_type: documentType,
            });

            setStage("uploading");
            let uploadSuccess = true;
            try {
                await uploadToStorage(upload_url, file);
            } catch {
                uploadSuccess = false;
            }

            setStage("confirming");
            const doc = await confirmUpload(document_id, uploadSuccess);

            if (!uploadSuccess) {
                setStage("error");
                setError("File upload to storage failed.");
                return;
            }

            setStage("processing");
            setUploadedDoc(doc);
            onUploaded(doc);

            await new Promise((r) => setTimeout(r, 800));
            setStage("done");

            setTimeout(() => navigate(`/cases/${caseId}`), 2000);
        } catch (err) {
            setStage("error");
            setError(err instanceof Error ? err.message : "Upload failed");
        }
    }

    function handleDone() {
        onClose();
    }

    return (
        <Modal
            kicker="Evidence intake"
            title="Upload document"
            onClose={isUploading ? () => {} : onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="doc-title"
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-surface-500"
                    >
                        Title <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="doc-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Police Incident Report"
                        disabled={isUploading}
                        className="w-full rounded-lg border border-surface-300 bg-surface-0/70 px-3 py-2 text-sm text-surface-900 outline-none transition placeholder:text-surface-500 focus:border-ember-500/70 focus:ring-2 focus:ring-ember-500/15 disabled:opacity-50"
                    />
                </div>

                <div>
                    <label
                        htmlFor="doc-description"
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-surface-500"
                    >
                        Description
                    </label>
                    <textarea
                        id="doc-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the document"
                        rows={2}
                        disabled={isUploading}
                        className="w-full resize-none rounded-lg border border-surface-300 bg-surface-0/70 px-3 py-2 text-sm text-surface-900 outline-none transition placeholder:text-surface-500 focus:border-ember-500/70 focus:ring-2 focus:ring-ember-500/15 disabled:opacity-50"
                    />
                </div>

                <div>
                    <label
                        htmlFor="doc-type"
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-surface-500"
                    >
                        Document type <span className="text-red-400">*</span>
                    </label>
                    <select
                        id="doc-type"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                        disabled={isUploading}
                        className="w-full cursor-pointer rounded-lg border border-surface-300 bg-surface-0/70 px-3 py-2 text-sm text-surface-900 outline-none transition focus:border-ember-500/70 focus:ring-2 focus:ring-ember-500/15 disabled:opacity-50"
                    >
                        {DOCUMENT_TYPES.map((dt) => (
                            <option key={dt.value} value={dt.value} className="bg-surface-100 text-surface-900">
                                {dt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-surface-500">
                        File <span className="text-red-400">*</span>
                    </label>
                    <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300 bg-surface-200/40 px-4 py-6 text-center transition hover:border-ember-500/50 hover:bg-ember-500/5 ${
                            isUploading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                    >
                        {file ? (
                            <>
                                <p className="font-mono text-sm font-medium text-surface-200">
                                    {file.name}
                                </p>
                                <p className="mt-0.5 font-mono text-xs text-surface-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </>
                        ) : (
                            <>
                                <Icon name="upload" size={22} className="mb-2 text-surface-500" />
                                <p className="font-mono text-xs text-surface-500">
                                    Click to select evidentiary file
                                </p>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                </div>

                <UploadProgress stage={stage} document={uploadedDoc} error={error} onDone={handleDone} />

                {stage === "idle" && (
                    <div className="flex justify-end gap-2 pt-1">
                        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" type="submit" disabled={!file || !title.trim()}>
                            Upload
                        </Button>
                    </div>
                )}

                {stage === "error" && (
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="primary" size="sm" type="submit">
                            Retry
                        </Button>
                    </div>
                )}
            </form>
        </Modal>
    );
}
