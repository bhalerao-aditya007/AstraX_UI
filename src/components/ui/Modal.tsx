// src/components/ui/Modal.tsx
// Props unchanged ({ title, onClose, children }).
// Entrance choreography: backdrop desaturates the room, the panel rises and
// settles (SETTLE easing) like a folder being set down under a desk lamp.

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import { Kicker } from "./Chip";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    kicker?: string;
    width?: string;
}

export default function Modal({
    title,
    onClose,
    children,
    kicker = "Case Action",
    width = "max-w-md",
}: ModalProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-surface-0/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, y: 22, scale: 0.975, rotate: -0.4 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className={`glass-strong lit-edge relative z-10 w-full ${width} rounded-2xl p-6 shadow-2xl`}
                >
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <Kicker tone="ember">{kicker}</Kicker>
                            <h2 className="mt-1.5 font-display text-lg font-bold tracking-tight text-surface-900">
                                {title}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-surface-500 transition hover:bg-surface-200 hover:text-surface-900"
                        >
                            <Icon name="cross" size={14} />
                        </button>
                    </div>

                    {children}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
