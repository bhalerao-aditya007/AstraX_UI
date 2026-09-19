import { useState } from "react";
import type { Case } from "../../services/cases";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface CaseModalProps {
    existingCase?: Case;
    onSubmit: (name: string) => Promise<void>;
    onClose: () => void;
}

export default function CaseModal({ existingCase, onSubmit, onClose }: CaseModalProps) {
    const [name, setName] = useState(existingCase?.name ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = Boolean(existingCase);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(name.trim());
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
            kicker={isEditing ? "Amend registry" : "Open new record"}
            title={isEditing ? "Edit case" : "Register case"}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="case-name"
                        className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-surface-500"
                    >
                        Case / FIR identifier
                    </label>
                    <input
                        id="case-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. FIR 108/2026 PS Kashmere Gate"
                        autoFocus
                        className="w-full rounded-lg border border-surface-300 bg-surface-0/70 px-3 py-2 font-mono text-sm text-surface-900 outline-none transition placeholder:text-surface-500 focus:border-ember-500/70 focus:ring-2 focus:ring-ember-500/15"
                    />
                </div>

                {error && <p className="font-mono text-xs text-red-400">{error}</p>}

                <div className="flex justify-end gap-2 pt-1">
                    <Button variant="ghost" size="sm" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Saving…" : isEditing ? "Save" : "Register"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
