// src/components/layout/Workspace.tsx
// Data flow (stores, bundle resolution, fact-sheet synthesis) is unchanged.

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import { getCaseDataBundle } from "../../data/multiCaseRegistry";
import { useDocumentsStore } from "../../store/documentsStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useCasesStore } from "../../store/casesStore";
import type { Document } from "../../services/documents";
import { synthesizeFactSheetFromDocuments } from "../../utils/factSheetSynthesizer";

import DocumentList from "../documents/DocumentList";
import UploadDocument from "../upload/UploadDocument";
import NetworkGraph from "../dashboard/analytics/NetworkGraph";
import FactSheet from "../summary/FactSheet";
import TrackBadge from "../ui/TrackBadge";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import { Kicker } from "../ui/Chip";
import { CountUp, Reveal } from "../motion";

export default function Workspace() {
    const selectedCaseId = useWorkspaceStore((state) => state.selectedCaseId);

    const { documents, isLoading, error, fetchDocuments, addDocument } = useDocumentsStore();

    const cases = useCasesStore((state) => state.cases);
    const selectedCase = cases.find((c) => c.id === selectedCaseId);

    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        if (selectedCaseId) fetchDocuments(selectedCaseId);
    }, [selectedCaseId, fetchDocuments]);

    const caseBundle = useMemo(
        () => getCaseDataBundle(selectedCaseId || undefined, selectedCase?.name, documents),
        [selectedCaseId, selectedCase?.name, documents]
    );

    const workspaceFactSheet = useMemo(() => {
        if (documents && documents.length > 0 && !selectedCaseId?.includes("case-")) {
            const synth = synthesizeFactSheetFromDocuments(
                documents,
                selectedCase?.id || selectedCaseId || "case-1",
                selectedCase?.name || caseBundle.caseName,
                (selectedCase?.track ?? caseBundle.track) as 1 | 2,
                selectedCase?.triage_reason || caseBundle.triageReason
            );
            if (synth.who.length > 0) return synth;
        }
        return caseBundle.factSheet;
    }, [documents, selectedCase, selectedCaseId, caseBundle]);

    const workspaceGraph = useMemo(() => caseBundle.unifiedGraph, [caseBundle]);

    const isTrack2 = (selectedCase?.track ?? 2) === 2;
    const exhibitCount =
        documents.length > 0 ? documents.length : caseBundle.factSheet.evidence?.length || 0;

    if (!selectedCaseId) {
        return (
            <main className="flex min-w-0 flex-1 items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <EmptyState
                        icon="folder"
                        title="No case open"
                        body="Pick a record from the registry to pull its exhibits, fact-sheet and network onto the desk."
                        stamp="desk clear"
                        action={
                            <Link to="/intake">
                                <Button size="sm">
                                    <Icon name="plus" size={13} />
                                    Start an evidence intake
                                </Button>
                            </Link>
                        }
                    />
                </div>
            </main>
        );
    }

    return (
        <>
            <main className="min-w-0 flex-1 space-y-6 overflow-y-auto p-6 lg:p-8">
                {/* ── Case header plate ───────────────────────────────── */}
                <Reveal className="bg-case-paper grain-overlay relative overflow-hidden rounded-xl border border-surface-300 p-6">
                    <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="space-y-2">
                            <Kicker tone="ember">Active case record</Kicker>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="font-display text-xl font-bold tracking-tight text-surface-900">
                                    {selectedCase?.name ?? "Case workspace"}
                                </h1>
                                <TrackBadge
                                    track={(selectedCase?.track as 1 | 2) || 2}
                                    triageReason={selectedCase?.triage_reason}
                                />
                            </div>
                            <div className="flex items-center gap-3 font-mono text-[11px] text-surface-500">
                                <span className="text-surface-700">{selectedCaseId}</span>
                                <span className="opacity-40">/</span>
                                <span>
                                    <CountUp value={exhibitCount} className="text-surface-700" />{" "}
                                    {exhibitCount === 1 ? "exhibit" : "exhibits"}
                                </span>
                                <span className="opacity-40">/</span>
                                <span>v{selectedCase?.version || 1}.0</span>
                            </div>
                        </div>

                        {isTrack2 && (
                            <Link
                                to={`/cases/${selectedCaseId}`}
                                className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-ember-500 px-5 py-2.5 text-xs font-semibold text-surface-900 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] transition-colors hover:bg-ember-400"
                            >
                                <Icon name="radar" size={14} />
                                <span>Open full analysis</span>
                                <Icon name="arrow-right" size={13} />
                            </Link>
                        )}
                    </div>

                    <p className="relative z-10 mt-4 border-t border-surface-300/70 pt-4 text-xs leading-relaxed text-surface-600">
                        {selectedCase?.triage_reason ||
                            "This case correlates organised financial and telecommunication irregularities. Multi-modality pipelines link extracted entities across banking ledgers and surveillance records."}
                    </p>
                </Reveal>

                {/* ── Network preview ─────────────────────────────────── */}
                <Reveal delay={0.05} className="rounded-xl border border-surface-300 bg-surface-100/70 p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 font-display text-sm font-bold tracking-tight text-surface-900">
                                <Icon name="network-graph" size={15} className="text-ember-300" />
                                <span>Case network — preview</span>
                            </h3>
                            <p className="mt-0.5 text-xs text-surface-500">
                                Confirmed evidentiary links only. Hypotheses are opt-in inside the
                                full analysis workspace.
                            </p>
                        </div>
                        {isTrack2 && (
                            <Link
                                to={`/cases/${selectedCaseId}#knowledge-graph`}
                                className="font-mono text-[11px] text-ember-300 hover:underline"
                            >
                                Full graph →
                            </Link>
                        )}
                    </div>

                    <div className="h-[340px] w-full">
                        <NetworkGraph
                            data={
                                workspaceGraph && workspaceGraph.nodes?.length > 0
                                    ? workspaceGraph
                                    : caseBundle.unifiedGraph
                            }
                            theme="digital"
                            showControls={false}
                        />
                    </div>
                </Reveal>

                {/* ── Exhibits ────────────────────────────────────────── */}
                <Reveal delay={0.08} className="rounded-xl border border-surface-300 bg-surface-100/70 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <Kicker tone="steel">Evidence on file</Kicker>
                            <h2 className="mt-1.5 font-display text-sm font-bold tracking-tight text-surface-900">
                                Case exhibits
                            </h2>
                        </div>
                        <Button size="sm" onClick={() => setShowUpload(true)}>
                            <Icon name="upload" size={13} />
                            Upload exhibit
                        </Button>
                    </div>

                    {isLoading && <Loader label="Pulling exhibits from the vault…" />}

                    {error && !isLoading && (
                        <EmptyState
                            dense
                            tone="error"
                            icon="alert-triangle"
                            title="Exhibit vault unreachable"
                            body={error}
                            stamp="retrieval failed"
                            action={
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => fetchDocuments(selectedCaseId)}
                                >
                                    Retry retrieval
                                </Button>
                            }
                        />
                    )}

                    {!isLoading && !error && <DocumentList documents={documents} />}
                </Reveal>

                {/* ── Embedded fact sheet (DESIGN.md §3.7) ────────────── */}
                <div className="pt-1">
                    <FactSheet
                        data={workspaceFactSheet}
                        caseId={selectedCase?.id || selectedCaseId}
                        isEmbedded
                    />
                </div>
            </main>

            {showUpload && (
                <UploadDocument
                    caseId={selectedCaseId}
                    onUploaded={(doc: Document) => addDocument(doc)}
                    onClose={() => setShowUpload(false)}
                />
            )}
        </>
    );
}
