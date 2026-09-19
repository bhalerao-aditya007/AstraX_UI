import type { Document } from "../../services/documents";
import DocumentItem from "./DocumentItem";
import EmptyState from "../ui/EmptyState";
import { RevealGroup, RevealItem } from "../motion";

interface DocumentListProps {
    documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
    if (documents.length === 0) {
        return (
            <EmptyState
                dense
                icon="file-text"
                title="No documents in this case yet"
                body="Upload a document to get started."
                stamp="0 exhibits"
            />
        );
    }

    return (
        <RevealGroup className="space-y-3">
            {documents.map((document) => (
                <RevealItem key={document.id}>
                    <DocumentItem document={document} />
                </RevealItem>
            ))}
        </RevealGroup>
    );
}
