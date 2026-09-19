// src/components/layout/Sidebar.tsx
// Store usage, service calls and props are unchanged — chrome only.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCasesStore } from "../../store/casesStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import type { Case } from "../../services/cases";

import CaseList from "../cases/CaseList";
import CaseModal from "../cases/CaseModal";
import Loader from "../ui/Loader";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import { Kicker } from "../ui/Chip";
import { CountUp } from "../motion";

type ModalState =
    | { mode: "closed" }
    | { mode: "create" }
    | { mode: "edit"; caseItem: Case };

export default function Sidebar() {
    const { cases, isLoading, error, fetchCases, createCase, updateCase, deleteCase } =
        useCasesStore();

    const { selectedCaseId, clearCase } = useWorkspaceStore();

    const [modal, setModal] = useState<ModalState>({ mode: "closed" });
    const [deleteTarget, setDeleteTarget] = useState<Case | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    function openCreate() {
        setModal({ mode: "create" });
    }
    function openEdit(caseItem: Case) {
        setModal({ mode: "edit", caseItem });
    }
    function openDelete(caseItem: Case) {
        setDeleteError(null);
        setDeleteTarget(caseItem);
    }
    function closeModal() {
        setModal({ mode: "closed" });
    }

    async function handleModalSubmit(name: string) {
        if (modal.mode === "create") await createCase({ name });
        else if (modal.mode === "edit") await updateCase(modal.caseItem.id, { name });
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteCase(deleteTarget.id);
            if (selectedCaseId === deleteTarget.id) clearCase();
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete case");
        } finally {
            setIsDeleting(false);
        }
    }

    const track2 = cases.filter((c) => (c.track ?? 2) === 2).length;

    return (
        <>
            <aside className="flex w-full shrink-0 flex-col border-r border-surface-300 bg-surface-50/60">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-surface-300 px-4 py-3.5">
                    <div>
                        <Kicker tone="ember">Case Registry</Kicker>
                        <div className="mt-1.5 flex items-baseline gap-2 font-mono text-[11px] text-surface-500">
                            <CountUp value={cases.length} className="text-sm text-surface-800" />
                            <span>records</span>
                            <span className="opacity-40">/</span>
                            <span className="text-ember-300/90">{track2} track-2</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        title="New case"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-surface-300 bg-surface-200/70 text-surface-500 transition hover:border-ember-500/40 hover:text-ember-300"
                    >
                        <Icon name="plus" size={13} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-2">
                    {isLoading && <Loader label="Reading case registry…" />}

                    {error && !isLoading && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/8 px-3 py-2.5">
                            <p className="text-xs text-red-300">{error}</p>
                            <button
                                type="button"
                                onClick={fetchCases}
                                className="mt-1.5 cursor-pointer font-mono text-[11px] text-surface-500 underline hover:text-surface-800"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <CaseList cases={cases} onEdit={openEdit} onDelete={openDelete} />
                    )}
                </div>
            </aside>

            {modal.mode !== "closed" && (
                <CaseModal
                    existingCase={modal.mode === "edit" ? modal.caseItem : undefined}
                    onSubmit={handleModalSubmit}
                    onClose={closeModal}
                />
            )}

            <AnimatePresence>
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-surface-0/80 backdrop-blur-md"
                            onClick={() => !isDeleting && setDeleteTarget(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                            className="glass-strong relative z-10 w-full max-w-sm rounded-2xl p-6"
                        >
                            <Kicker tone="neutral">Destructive action</Kicker>
                            <h2 className="mt-2 font-display text-base font-bold text-surface-900">
                                Purge case record?
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-surface-500">
                                <span className="font-mono text-surface-800">{deleteTarget.name}</span>{" "}
                                and every exhibit attached to it will be permanently removed from the
                                registry.
                            </p>

                            {deleteError && (
                                <p className="mt-3 font-mono text-xs text-red-400">{deleteError}</p>
                            )}

                            <div className="mt-5 flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isDeleting}
                                    onClick={() => setDeleteTarget(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                >
                                    {isDeleting ? "Purging…" : "Purge record"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
