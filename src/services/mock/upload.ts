import type { Document, DocumentType } from "../documents";
import {
    addMockDocument,
    getMockDocument,
    updateMockDocumentStatus,
} from "./documents";

export interface InitiateUploadInput {
    case_id: string;
    title: string;
    description: string;
    file_name: string;
    document_type: DocumentType;
}

export interface InitiateUploadResponse {
    document_id: string;
    upload_url: string;
    object_key: string;
}


function extractInfoForUpload(fileName: string, title: string, docType: DocumentType): Record<string, any> {
    const combined = `${fileName} ${title}`.toLowerCase();

    if (combined.includes("fir") || combined.includes("complaint") || combined.includes("108")) {
        return {
            document_type: "First Information Report",
            fir_number: "108/2026",
            district: "North Delhi",
            police_station: "Kashmere Gate",
            incident_datetime: "2026-03-11 15:30",
            place_of_occurrence: "Kashmere Gate Metro Concourse & Mori Gate Inter-State Bus Terminus",
            complainant: { name: "Inspector Arvind Rawat" },
            accused: [
                { name: "Rajesh Sharma", alias: "Bhaiji", role: "Hawala Operator & Syndicate Coordinator" },
                { name: "Vikram Malhotra", alias: "Vicky", role: "Cash Courier & Logistics Driver" },
                { name: "Tariq 'Kabootar' Khan", alias: "Kabootar", role: "Syndicate Kingpin & Offshore Dispatcher" },
                { name: "Imran Qureshi", alias: "Chhota Imran", role: "Syndicate Enforcer" },
            ],
            acts_and_sections: [
                { act: "BNS", section: "111", statute: "Organized Crime Syndicate" },
                { act: "BNS", section: "316(2)", statute: "Criminal Breach of Trust" },
                { act: "PMLA", section: "3", statute: "Money Laundering" },
                { act: "IT Act", section: "66D", statute: "Cheating by Impersonation" },
            ],
            vehicles: [{ plate: "DL-01-AB-1234", registration: "DL-01-AB-1234", make: "Hyundai Creta (White)" }],
            narrative: "Interstate syndicate executing Hawala cash structuring through Kashmere Gate transit corridor. Rajesh Sharma operating Axis Bank account 4901238910. Courier intercepted driving DL-01-AB-1234 with cash and 12 burner SIMs.",
            transcribed_text: "FIR No: 108/2026 PS Kashmere Gate. Accused Rajesh Sharma operating Axis Bank A/c 4901238910 for structured cash pooling. Vikram Malhotra intercepted driving DL-01-AB-1234.",
            confidence: 0.99,
        };
    }

    if (combined.includes("seizure") || combined.includes("mori") || combined.includes("panchnama")) {
        return {
            document_type: "Seizure Memo / Panchnama",
            fir_number: "108/2026",
            district: "North Delhi",
            police_station: "Kashmere Gate",
            incident_datetime: "2026-03-11 17:30",
            place_of_occurrence: "Mori Gate Inter-State Bus Terminus, North Delhi",
            accused: [
                { name: "Vikram Malhotra", alias: "Vicky", role: "Cash Courier & Driver" },
                { name: "Imran Qureshi", alias: "Chhota Imran", role: "Syndicate Enforcer" },
            ],
            witnesses: ["Panch Witness 1: Ramesh Kumar", "Panch Witness 2: Sushma Devi"],
            seized_items: [
                "1x White Hyundai Creta (DL-01-AB-1234)",
                "Cash INR 24,50,000 in Rs 500 bundles",
                "12x Pre-activated burner SIM cards",
                "1x Forged Aadhaar card under 'Rakesh Verma'",
            ],
            confidence: 1.0,
        };
    }

    if (combined.includes("cctv") || combined.includes("anpr") || combined.includes("cam")) {
        return {
            document_type: "CCTV ANPR Video Telemetry",
            fir_number: "108/2026",
            incident_datetime: "2026-03-11 02:42",
            place_of_occurrence: "Kashmere Gate Flyover & Mori Gate Junction",
            vehicles: [{ plate: "DL-01-AB-1234", make: "Hyundai Creta (White)" }],
            narrative: "ANPR camera DL-DEL-KG-FLY-CAM04 captured White Hyundai Creta DL-01-AB-1234 moving South towards Mori Gate at 62.4 km/h.",
            confidence: 0.97,
        };
    }

    if (combined.includes("wiretap") || combined.includes("session") || combined.includes("audio") || combined.includes("intercept")) {
        return {
            document_type: "Audio Intercept / Wiretap",
            fir_number: "108/2026",
            incident_datetime: "2026-03-11 01:15",
            place_of_occurrence: "Chandni Chowk Cell Tower Hub DEL-442",
            accused: [
                { name: "Rajesh Sharma", alias: "Bhaiji", role: "Caller (+91-98110-44901)" },
                { name: "Tariq 'Kabootar' Khan", alias: "Kabootar", role: "Recipient (+971-50-998-1294, Dubai)" },
            ],
            narrative: "Intercepted call discussing cash delivery at Mori Gate in White Creta DL-01-AB-1234 and 10 structuring deposits into Axis Bank 4901238910.",
            confidence: 0.98,
        };
    }

    if (combined.includes("axis") || combined.includes("bank") || combined.includes("structuring") || combined.includes("csv")) {
        return {
            document_type: "Bank Statement / CSV",
            account_number: "4901238910",
            bank_name: "Axis Bank",
            account_holder: "Rajesh Sharma",
            total_deposits: 489000,
            total_transactions: 11,
            structuring_alerts: 10,
            offshore_transfers: 1,
            offshore_beneficiary: "Al-Noor Export FZE (Dubai)",
            offshore_amount: 489000,
            accused: [
                { name: "Vikram Malhotra", alias: "Vicky", role: "Cash Depositor (Smurfing)" },
                { name: "Rajesh Sharma", alias: "Bhaiji", role: "Account Beneficiary" },
            ],
            narrative: "10 structured cash deposits of INR 48,000-49,500 each into Axis Bank A/c 4901238910 within 5-hour window, followed by outward RTGS of INR 4,89,000 to Dubai.",
            confidence: 0.99,
        };
    }

    if (combined.includes("bio") || combined.includes("aadhaar") || combined.includes("imran")) {
        return {
            document_type: "Biometric Forensic Dossier",
            fir_number: "108/2026",
            incident_datetime: "2026-03-11 18:00",
            place_of_occurrence: "CFSL Central Forensic Science Laboratory",
            accused: [
                { name: "Imran Qureshi", alias: "Chhota Imran / Rakesh Verma", role: "Syndicate Enforcer" },
            ],
            narrative: "AFIS 10-print biometric match (98.4%) establishing suspect carried forged Aadhaar under 'Rakesh Verma'.",
            confidence: 0.98,
        };
    }

    // Generic fallback for any user document
    return {
        document_type: docType === "video" ? "Video Telemetry" : docType === "voice" ? "Audio Recording" : docType === "image" ? "Forensic Image" : "Case Document",
        incident_datetime: new Date().toISOString(),
        place_of_occurrence: "Jurisdiction Precinct",
        accused: [{ name: "Target Subject", alias: "Suspect", role: "Accused Party" }],
        narrative: `Evidence extracted from ${fileName}: telemetry verified and indexed into active graph.`,
        confidence: 0.95,
    };
}

const delay = (ms = 500) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// ─── Initiate ────────────────────────────────────────────────────────────────

export async function initiateUpload(
    data: InitiateUploadInput
): Promise<InitiateUploadResponse> {
    await delay(400);

    const now = new Date().toISOString();
    const documentId = crypto.randomUUID();
    const objectKey = `${documentId}/${data.file_name}`;

    // Add a pending document to the shared mock store
    const newDoc: Document = {
        id: documentId,
        title: data.title,
        description: data.description,
        status: "pending",
        document_type: data.document_type,
        object_key: objectKey,
        extracted_information: extractInfoForUpload(data.file_name, data.title, data.document_type),
        case_id: data.case_id,
        created_at: now,
        updated_at: now,
    };

    addMockDocument(newDoc);

    // Return a fake presigned URL (the upload step will be a no-op in mock mode)
    return {
        document_id: documentId,
        upload_url: `https://mock-s3.example.com/upload/${objectKey}`,
        object_key: objectKey,
    };
}

// ─── Confirm ─────────────────────────────────────────────────────────────────

export async function confirmUpload(
    documentId: string,
    success: boolean
): Promise<Document> {
    await delay(500);

    if (success) {
        // Move document to "success"
        updateMockDocumentStatus(documentId, "success");
    } else {
        // Mark as failed
        updateMockDocumentStatus(documentId, "failed");
    }

    return getMockDocument(documentId);
}
