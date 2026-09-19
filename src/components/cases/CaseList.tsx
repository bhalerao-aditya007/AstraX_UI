import type { Case } from "../../services/cases";
import CaseItem from "./CaseItem";
import EmptyState from "../ui/EmptyState";
import { RevealGroup, RevealItem } from "../motion";

interface CaseListProps {
    cases: Case[];
    onEdit: (caseItem: Case) => void;
    onDelete: (caseItem: Case) => void;
}

export default function CaseList({ cases, onEdit, onDelete }: CaseListProps) {
    if (cases.length === 0) {
        return (
            <EmptyState
                dense
                icon="folder"
                title="No cases on file"
                body="Register an intake to open the first case record for this station."
                stamp="registry empty"
            />
        );
    }

    return (
        <RevealGroup className="space-y-1">
            {cases.map((c) => (
                <RevealItem key={c.id}>
                    <CaseItem caseItem={c} onEdit={onEdit} onDelete={onDelete} />
                </RevealItem>
            ))}
        </RevealGroup>
    );
}
