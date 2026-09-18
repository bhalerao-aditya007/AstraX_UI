import { create } from "zustand";

import type { Case } from "../services/cases";
import {
    getCases,
    createCase as svcCreateCase,
    updateCase as svcUpdateCase,
    deleteCase as svcDeleteCase,
} from "../services/cases";
import type { CreateCaseInput, UpdateCaseInput } from "../services/cases";

// Pre-populated cases so the UI never shows 0 on first render
const INITIAL_CASES: Case[] = [
    {
        id: "case-4",
        name: "FIR 108/2026: Kashmere Gate Interstate Hawala Syndicate",
        track: 2,
        triage_reason: "Interstate syndicate: Kashmere Gate ISBT transit corridor, Axis Bank sub-Rs 50k structuring, and Dubai offshore layering.",
        version: 2,
        created_at: "2026-09-04T09:00:00Z",
        updated_at: "2026-09-11T16:30:00Z",
    },
    {
        id: "case-1",
        name: "FIR 101/2026: Apex Financial Syndicate Investigation",
        track: 2,
        triage_reason: "Multi-jurisdiction syndicate: 4 shell entities, Wasabi crypto mixer cluster, and international burner relays.",
        version: 2,
        created_at: "2026-09-01T10:00:00Z",
        updated_at: "2026-09-08T11:45:00Z",
    },
    {
        id: "case-2",
        name: "FIR 44/2026: Cybercrime Ransomware Investigation",
        track: 2,
        triage_reason: "Complex network: Multiple compromised nodes, C2 server communications, and Darknet wallet addresses.",
        version: 1,
        created_at: "2026-09-02T11:30:00Z",
        updated_at: "2026-09-02T11:30:00Z",
    },
    {
        id: "case-3",
        name: "NCR 12/2026: Local Commercial Inventory Dispute",
        track: 1,
        triage_reason: "Routine case: Single direct complainant and accused, localized to single precinct. No syndicate pattern detected.",
        version: 1,
        created_at: "2026-09-03T14:20:00Z",
        updated_at: "2026-09-03T14:20:00Z",
    },
];

interface CasesState {
    cases: Case[];
    isLoading: boolean;
    error: string | null;

    fetchCases: () => Promise<void>;
    createCase: (data: CreateCaseInput) => Promise<Case>;
    updateCase: (id: string, data: UpdateCaseInput) => Promise<Case>;
    deleteCase: (id: string) => Promise<void>;
}

export const useCasesStore = create<CasesState>((set) => ({
    cases: INITIAL_CASES,
    isLoading: false,
    error: null,

    fetchCases: async () => {
        set({ isLoading: true, error: null });

        try {
            const cases = await getCases();
            set({ cases, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load cases",
            });
        }
    },

    createCase: async (data) => {
        const newCase = await svcCreateCase(data);
        set((state) => ({ cases: [...state.cases, newCase] }));
        return newCase;
    },

    updateCase: async (id, data) => {
        const updated = await svcUpdateCase(id, data);
        set((state) => ({
            cases: state.cases.map((c) => (c.id === id ? updated : c)),
        }));
        return updated;
    },

    deleteCase: async (id) => {
        await svcDeleteCase(id);
        set((state) => ({
            cases: state.cases.filter((c) => c.id !== id),
        }));
    },
}));
