// src/components/layout/DashboardLayout.tsx
// Same 3-column concept (evidence rail · workspace · inspector) and identical
// state/resize logic — only the chrome and transitions were redesigned.

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useDocumentsStore } from "../../store/documentsStore";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";
import DocumentViewer from "../documents/DocumentViewer";
import Icon from "../ui/Icon";

export default function DashboardLayout() {
    const selectedDocumentId = useWorkspaceStore((state) => state.selectedDocumentId);
    const documents = useDocumentsStore((state) => state.documents);
    const selectedDocument = documents.find((d) => d.id === selectedDocumentId);

    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(false);

    const [rightWidth, setRightWidth] = useState(520);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 320 && newWidth < window.innerWidth * 0.8) setRightWidth(newWidth);
        };
        const handleMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                document.body.style.cursor = "";
            }
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    useEffect(() => {
        if (selectedDocumentId) setRightOpen(true);
    }, [selectedDocumentId]);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-surface-0 text-surface-700">
            <Navbar />

            {/* Command strip */}
            <div className="z-20 flex items-center justify-between border-b border-surface-300 bg-surface-50/70 px-4 py-1.5 font-mono text-[11px] backdrop-blur">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setLeftOpen(!leftOpen)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-800"
                    >
                        <Icon name="folder" size={12} />
                        <span>{leftOpen ? "Hide registry" : "Show registry"}</span>
                    </button>
                    <span className="text-surface-400">·</span>
                    <span className="text-surface-500">Operational records database</span>
                </div>

                {selectedDocumentId && (
                    <button
                        type="button"
                        onClick={() => setRightOpen(!rightOpen)}
                        className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-surface-500 transition-colors hover:bg-surface-200 hover:text-surface-800"
                    >
                        <span>{rightOpen ? "Close exhibit" : "Open exhibit"}</span>
                        <Icon name="file-text" size={12} />
                    </button>
                )}
            </div>

            <div className="relative flex min-h-0 flex-1 overflow-hidden">
                {/* Left: evidence / case rail */}
                <motion.div
                    animate={{ width: leftOpen ? 320 : 0, opacity: leftOpen ? 1 : 0 }}
                    initial={false}
                    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    className="flex shrink-0 overflow-hidden"
                >
                    <div className="flex h-full w-80 shrink-0">
                        <Sidebar />
                    </div>
                </motion.div>

                {/* Centre: workspace */}
                <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-surface-0">
                    <Workspace />
                </div>

                {/* Right: exhibit inspector */}
                <AnimatePresence>
                    {rightOpen && selectedDocument && (
                        <>
                            <div
                                className="z-30 w-1.5 cursor-col-resize bg-surface-300 transition-colors hover:bg-ember-500/70"
                                onMouseDown={() => {
                                    isDraggingRef.current = true;
                                    document.body.style.cursor = "col-resize";
                                }}
                            />
                            <motion.div
                                initial={{ x: 40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 40, opacity: 0 }}
                                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                                style={{ width: `${rightWidth}px` }}
                                className="z-20 flex h-full shrink-0 flex-col border-l border-surface-300 bg-surface-50/80 backdrop-blur"
                            >
                                <DocumentViewer document={selectedDocument} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
