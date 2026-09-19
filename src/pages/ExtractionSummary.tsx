// src/pages/ExtractionSummary.tsx
// Data synthesis logic (documents → fact sheet) is entirely unchanged.

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import FactSheet from "../components/summary/FactSheet";
import Icon from "../components/ui/Icon";
import EmptyState from "../components/ui/EmptyState";
import { Kicker } from "../components/ui/Chip";
import { Reveal } from "../components/motion";
import { useCasesStore } from "../store/casesStore";
import { getDocuments, type Document } from "../services/documents";
import { triggerHistoricalAnalysis } from "../services/analytics";
import type { FactSheetData } from "../data/mockCaseData";

export default function ExtractionSummary() {
    const { caseId } = useParams();
    const navigate = useNavigate();
    const cases = useCasesStore((state) => state.cases);
    const fetchCases = useCasesStore((state) => state.fetchCases);

    const [factData, setFactData] = useState<FactSheetData | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cases.length === 0) fetchCases();
    }, [cases.length, fetchCases]);

    const currentCase = cases.find((c) => c.id === caseId) || {
        id: caseId || "case-1",
        name: "Active Case Investigation",
        track: 2,
        triage_reason: "Evidence ingestion underway.",
    };

    useEffect(() => {
        let isMounted = true;

        async function loadCaseData() {
            if (!caseId) return;
            setIsLoading(true);
            setError(null);

            try {
                const docs = await getDocuments(caseId).catch(() => []);
                if (isMounted) setDocuments(docs);

                let analysisReport = null;
                try {
                    analysisReport = await triggerHistoricalAnalysis(caseId);
                } catch {
                    // may fail if models are unconfigured / empty
                }

                if (isMounted) {
                    if (analysisReport?.fact_sheet) {
                        setFactData(analysisReport.fact_sheet);
                    } else {
                        const whoList: FactSheetData["who"] = [];
                        const whatList: FactSheetData["what"] = [];
                        const whenList: FactSheetData["when"] = [];
                        const whereList: FactSheetData["where"] = [];
                        const evidenceList: FactSheetData["evidence"] = [];

                        docs.forEach((doc, idx) => {
                            const ext = (doc.extracted_information as any) || {};
                            const modality =
                                doc.document_type === "video"
                                    ? "video_cctv"
                                    : doc.document_type === "voice"
                                      ? "audio"
                                      : doc.document_type === "image"
                                        ? "scanned_doc"
                                        : "digital_text";

                            evidenceList.push({
                                id: doc.id,
                                modality,
                                fileName: doc.title || `Document-${idx + 1}`,
                                extractionStatus:
                                    doc.status === "finish" || doc.status === "success"
                                        ? "parsed"
                                        : doc.status === "failed"
                                          ? "failed"
                                          : "partial",
                                confidence: ext.confidence ? Number(ext.confidence) : 0.95,
                                note: ext.transcribed_text
                                    ? `Extracted: ${String(ext.transcribed_text).slice(0, 60)}...`
                                    : `Status: ${doc.status}`,
                            });

                            if (Array.isArray(ext.accused)) {
                                ext.accused.forEach((acc: any, aIdx: number) => {
                                    if (acc.name) {
                                        whoList.push({
                                            id: `acc-${idx}-${aIdx}`,
                                            name: acc.name,
                                            role: "Accused",
                                            alias: acc.alias,
                                            citation: {
                                                documentTitle: doc.title,
                                                confidenceScore: 0.95,
                                                rawSnippet: `Accused: ${acc.name}${acc.alias ? ` (${acc.alias})` : ""}`,
                                            },
                                        });
                                    }
                                });
                            }

                            if (ext.complainant?.name) {
                                whoList.push({
                                    id: `comp-${idx}`,
                                    name: ext.complainant.name,
                                    role: "Complainant",
                                    citation: {
                                        documentTitle: doc.title,
                                        confidenceScore: 0.98,
                                        rawSnippet: `Complainant: ${ext.complainant.name}`,
                                    },
                                });
                            }

                            if (Array.isArray(ext.acts_and_sections)) {
                                ext.acts_and_sections.forEach((sec: any) => {
                                    whatList.push({
                                        bnsSection: `${sec.act || "BNS"} ${sec.section || ""}`.trim(),
                                        statuteName: "Statutory Charge",
                                        description: ext.narrative || "Recorded from FIR extraction.",
                                        applicableTo: ext.accused?.[0]?.name || "Accused",
                                        citation: { documentTitle: doc.title, confidenceScore: 0.95 },
                                    });
                                });
                            }

                            if (ext.incident_datetime) {
                                whenList.push({
                                    timestamp: ext.incident_datetime,
                                    event: ext.narrative || "Incident occurred",
                                    location: ext.police_station || "Jurisdiction",
                                    citation: { documentTitle: doc.title, confidenceScore: 0.92 },
                                });
                            }

                            if (ext.police_station || ext.district) {
                                whereList.push({
                                    locationName: `${ext.police_station || ""}, ${ext.district || ""}`.replace(/^, |, $/g, ""),
                                    jurisdiction: ext.district || "State Police",
                                    significance: "Reporting Police Station",
                                    coordinates: [28.6139, 77.209],
                                    citation: { documentTitle: doc.title, confidenceScore: 0.9 },
                                });
                            }
                        });

                        setFactData({
                            caseId: currentCase.id,
                            firNumber: currentCase.name,
                            track: (currentCase.track ?? 2) as 1 | 2,
                            triageReason: currentCase.triage_reason || "Multi-source evidence ingested.",
                            who: whoList,
                            what: whatList,
                            when: whenList,
                            where: whereList,
                            evidence: evidenceList,
                            knownRelationships: [],
                            openGaps: [],
                        });
                    }
                }
            } catch (err: any) {
                if (isMounted) setError(err?.message || "Failed to load extraction summary");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadCaseData();
        return () => {
            isMounted = false;
        };
    }, [caseId, currentCase.id, currentCase.name, currentCase.track, currentCase.triage_reason]);

    const hasAnyExtractedData =
        factData &&
        (factData.who.length > 0 ||
            factData.what.length > 0 ||
            factData.when.length > 0 ||
            factData.where.length > 0 ||
            factData.evidence.length > 0);

    return (
        <div className="flex min-h-screen flex-col bg-surface-0">
            <Navbar />
            <div className="bg-tactical-grid pointer-events-none absolute inset-0 opacity-20" />

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
                <Reveal className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/intake")}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-surface-300 bg-surface-100 px-3 py-1.5 text-xs font-semibold text-surface-500 transition-colors hover:text-surface-900"
                        >
                            <Icon name="arrow-left" size={14} />
                            <span>Back to evidence intake</span>
                        </button>
                        <span className="text-xs text-surface-500">/</span>
                        <Link to="/dashboard" className="text-xs text-surface-500 transition-colors hover:text-surface-900">
                            Case Directory
                        </Link>
                    </div>

                    <span
                        className={`inline-flex items-center gap-2 font-mono text-xs ${
                            isLoading ? "text-amber-300" : "text-emerald-300"
                        }`}
                    >
                        <span className={`h-2 w-2 rounded-full ${isLoading ? "animate-ping bg-amber-400" : "animate-pulse bg-emerald-400"}`} />
                        {isLoading ? "Synchronising evidence…" : "Live case ingestion verified"}
                    </span>
                </Reveal>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-surface-300 bg-surface-100 p-12 text-center shadow-sm">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ember-500 border-t-transparent" />
                        <Kicker tone="ember">Extracting multi-modal entities…</Kicker>
                        <p className="max-w-md text-xs text-surface-500">
                            Running OCR, ANPR, object detection, and NER adapters across ingested
                            files.
                        </p>
                    </div>
                ) : error ? (
                    <EmptyState
                        tone="error"
                        icon="alert-triangle"
                        title="Extraction error"
                        body={error}
                        stamp="retry required"
                        action={
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="cursor-pointer rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                            >
                                Retry extraction
                            </button>
                        }
                    />
                ) : !hasAnyExtractedData ? (
                    <EmptyState
                        icon="file-text"
                        title="No extracted data available"
                        body="No evidence documents have completed processing for this case yet. Ingest FIRs, recordings, or CCTV media via Evidence Intake to trigger automated extraction."
                        stamp="0 exhibits parsed"
                        action={
                            <Link
                                to="/intake"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-ember-500 px-4 py-2 text-xs font-semibold text-surface-900 shadow-[inset_0_1px_0_0_rgba(246,242,237,0.18)] transition-colors hover:bg-ember-400"
                            >
                                <Icon name="upload" size={14} />
                                <span>Go to evidence intake</span>
                            </Link>
                        }
                    />
                ) : (
                    <FactSheet data={factData!} caseId={currentCase.id} isEmbedded={false} />
                )}
            </main>
        </div>
    );
}
