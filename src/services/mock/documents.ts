import type { Document, DocumentStatus } from "../documents";

const now = new Date().toISOString();

let mockDocuments: Document[] = [
    // ═══════════════════════════════════════════════════════════════
    // ▌ Case 1 — FIR 101/2026: Apex Financial Syndicate Investigation
    // ═══════════════════════════════════════════════════════════════

        // -------------------------------------------------------------
    // Case 1 - FIR 101/2026: Apex Financial Syndicate Investigation
    // -------------------------------------------------------------
    {
        id: "doc-1",
        title: "FIR 101/2026 First Information Report",
        description: "FIRST INFORMATION REPORT (Under Section 173 BNSS, 2023). District: South-West Delhi. PS: Vasant Kunj. FIR No: 101/2026.",
        status: "success",
        document_type: "text",
        object_key: "doc-1/fir_101_2026_vasantkunj.pdf",
        extracted_information: {
            document_type: "First Information Report",
            fir_number: "101/2026",
            district: "South-West Delhi",
            police_station: "Vasant Kunj",
            incident_datetime: "2026-08-31 10:00",
            place_of_occurrence: "Vasant Kunj Corporate Park & Cyber City Gateway",
            complainant: { name: "DSP Meera Bhat" },
            accused: [
                { name: "Rajiv Singhal", alias: "RS", role: "Managing Director & Syndicate Mastermind" },
                { name: "Meera Kulkarni", alias: "", role: "CFO, Apex Logistics LLC & Shell Account Signatory" },
                { name: "Arjun Nambiar", alias: "Nambiar", role: "Offshore Shell Trustee (Port Louis, Mauritius)" },
                { name: "Sanjay Singhania", alias: "CA Sanjay", role: "Chartered Accountant & Ledger Auditor" },
            ],
            victim: { name: "Sunil Narang", role: "Managing Director, Narang Global Infrastructure" },
            acts_and_sections: [
                { act: "BNS", section: "316(2)", statute: "Criminal Breach of Trust" },
                { act: "BNS", section: "318(4)", statute: "Cheating & Dishonestly Inducing Delivery" },
                { act: "PMLA", section: "3", statute: "Offence of Money Laundering" },
                { act: "Companies Act", section: "447", statute: "Corporate Fraud" },
            ],
            vehicles: [{ plate: "DL-3C-AZ-9988", registration: "DL-3C-AZ-9988", make: "Mercedes-Benz E-Class (Black)" }],
            narrative: "Apex Capital Holdings and Goldcrest Overseas orchestrated an offshore round-tripping scheme defrauding investors of INR 48.5 Crore. Managing Director Rajiv Singhal and CFO Meera Kulkarni routed corporate loans through 14 fictitious export entities before wiring tranches to Port Louis, Mauritius through trustee Arjun Nambiar. Forged letters of credit and fake bills of lading were seized.",
            transcribed_text: "FIR No: 101/2026 PS Vasant Kunj. Complainant DSP Meera Bhat acting on reference from EOW. Accused Rajiv Singhal and Meera Kulkarni operated fraudulent shell network Apex Logistics LLC. Fake capital equipment imports worth INR 48.5 Crore fabricated to justify offshore RTGS transfers.",
            confidence: 0.98,
        },
        case_id: "case-1",
        created_at: "2026-09-01T10:00:00Z",
        updated_at: "2026-09-01T10:00:00Z",
    },

    {
        id: "doc-2",
        title: "HDFC A/c 9901244011 Round-Tripping Statement",
        description: "Corporate banking ledger showing INR 48.5 Crore layering into shell entities and Mauritius RTGS transfers.",
        status: "success",
        document_type: "text",
        object_key: "doc-2/hdfc_roundtrip_9901.csv",
        extracted_information: {
            document_type: "Bank Statement / CSV",
            account_number: "9901244011",
            bank_name: "HDFC Bank Corporate Banking",
            account_holder: "Apex Logistics LLC (Signatory: Meera Kulkarni)",
            total_deposits: 485000000,
            total_transactions: 18,
            structuring_alerts: 6,
            offshore_transfers: 6,
            offshore_beneficiary: "Goldcrest Overseas FZE (Port Louis, Mauritius)",
            offshore_amount: 485000000,
            accused: [
                { name: "Meera Kulkarni", alias: "", role: "Authorised Account Signatory" },
                { name: "Rajiv Singhal", alias: "RS", role: "Beneficial Owner" },
            ],
            narrative: "Primary inflow account received INR 48.5 Crore from consortium credit line. Within 72 hours, funds split into 6 wire transfers of ~INR 8.08 Crore each to Goldcrest Overseas FZE Mauritius. No legitimate trade activity or customs clearance records exist for corresponding invoices.",
            transcribed_text: "HDFC Corporate Ledger A/c 9901244011. Inward credit INR 48,50,00,000 layered through 6 tranches to Goldcrest Overseas FZE (Mauritius). Flagged for trade-based money laundering (TBML).",
            confidence: 0.99,
        },
        case_id: "case-1",
        created_at: "2026-09-02T08:00:00Z",
        updated_at: "2026-09-08T11:45:00Z",
    },

    {
        id: "doc-3",
        title: "Search & Seizure Panchnama — Apex Tower Suite",
        description: "Panchnama under Section 105 BSA, 2023 documenting corporate raid at Vasant Kunj Commercial Complex.",
        status: "success",
        document_type: "text",
        object_key: "doc-3/seizure_memo_apex_tower.pdf",
        extracted_information: {
            document_type: "Seizure Memo / Panchnama",
            fir_number: "101/2026",
            district: "South-West Delhi",
            police_station: "Vasant Kunj",
            incident_datetime: "2026-09-02 06:30",
            place_of_occurrence: "Suite 504, Apex Tower, Vasant Kunj Commercial Complex",
            accused: [
                { name: "Rajiv Singhal", alias: "RS", role: "Managing Director" },
                { name: "Sanjay Singhania", alias: "CA Sanjay", role: "Auditor / Facilitator" },
            ],
            seized_items: [
                "1x MacBook Pro M3 (Encrypted hawala and shell company accounting ledgers)",
                "14x Dummy Corporate Rubber Stamps (Goldcrest, Apex Global, Trans-Oceanic)",
                "Forged Board Resolution dated 2026-06-15 with counterfeit signature of Sunil Narang",
                "Pre-signed blank cheques of Axis Bank Corporate A/c 5019920145",
                "Keys and registration documents for Mercedes-Benz DL-3C-AZ-9988",
                "3x iPhone 15 Pro devices with encrypted Signal communication traces",
            ],
            vehicles: [{ plate: "DL-3C-AZ-9988", registration: "DL-3C-AZ-9988", make: "Mercedes-Benz E-Class" }],
            narrative: "Search conducted at Apex Corporate Suite. Forensic team seized 14 rubber stamps of unlisted shell corporations, an encrypted MacBook Pro with dual accounting spreadsheets, pre-signed blank cheques, and forged board authorizations authorizing the ₹48.5 Cr wire transfers.",
            transcribed_text: "SEIZURE PANCHNAMA: FIR 101/2026 PS Vasant Kunj. Raid on Suite 504 Apex Tower. Recovered 14 corporate rubber stamps, MacBook Pro M3 containing offshore banking records, and forged loan guarantee agreements.",
            confidence: 0.98,
        },
        case_id: "case-1",
        created_at: "2026-09-02T07:00:00Z",
        updated_at: "2026-09-02T07:00:00Z",
    },

    {
        id: "doc-1b",
        title: "Audio Intercept — Singhal-Nambiar Signal Call",
        description: "Encrypted voice intercept transcript between Rajiv Singhal and offshore trustee Arjun Nambiar.",
        status: "success",
        document_type: "voice",
        object_key: "doc-1b/wiretap_singhal_nambiar_call.wav",
        extracted_information: {
            document_type: "Audio Intercept Transcript",
            fir_number: "101/2026",
            incident_datetime: "2026-08-30 22:45",
            place_of_occurrence: "Signal Protocol Intercept / Tower Vasant Kunj DEL-802",
            accused: [
                { name: "Rajiv Singhal", alias: "RS", role: "Managing Director" },
                { name: "Arjun Nambiar", alias: "Nambiar", role: "Offshore Shell Trustee" },
            ],
            narrative: "Intercepted call on Signal application. Rajiv Singhal instructs Arjun Nambiar in Mauritius to confirm receipt of the final USD 5.8M (INR 48.5 Cr) tranche into Goldcrest Overseas FZE and immediately disperse into private discretionary trusts before Indian regulatory scrutiny.",
            transcribed_text: "Speaker 1 (Rajiv Singhal): 'Nambiar, the fourth tranche of 8 crore cleared from HDFC today. Total 48.5 Cr is now in Port Louis. Generate the fictitious capital machinery bills immediately.' Speaker 2 (Arjun Nambiar): 'Understood RS. Goldcrest invoices are logged. Disbursing to the discretionary trust sub-accounts tonight.'",
            confidence: 0.97,
        },
        case_id: "case-1",
        created_at: "2026-09-01T14:00:00Z",
        updated_at: "2026-09-01T14:00:00Z",
    },

    {
        id: "doc-1c",
        title: "CCTV ANPR — Vasant Kunj & IGI Airport Toll",
        description: "ANPR camera telemetry tracking Mercedes DL-3C-AZ-9988 movements between corporate suite and airport.",
        status: "success",
        document_type: "video",
        object_key: "doc-1c/cctv_anpr_vasantkunj_cam11.mp4",
        extracted_information: {
            document_type: "CCTV / ANPR Telemetry",
            fir_number: "101/2026",
            incident_datetime: "2026-09-01 03:15",
            place_of_occurrence: "Vasant Kunj Toll Plaza & IGI Terminal 3 Expressway",
            vehicle: { plate: "DL-3C-AZ-9988", speed_kmh: 88.5, model: "Mercedes-Benz E-Class" },
            narrative: "Suspect vehicle DL-3C-AZ-9988 recorded exiting Vasant Kunj Corporate Park at 02:48 AM and arriving at IGI Airport Terminal 3 at 03:15 AM. Driver identified as Rajiv Singhal attempting late-night departure to Dubai/Mauritius.",
            transcribed_text: "ANPR Telemetry Cam 11: DL-3C-AZ-9988 Black Mercedes-Benz clocked at 88.5 km/h. Driver visual match 95.4% Rajiv Singhal. Intercepted by immigration prior to boarding flight EK-513.",
            confidence: 0.96,
        },
        case_id: "case-1",
        created_at: "2026-09-01T04:00:00Z",
        updated_at: "2026-09-01T04:00:00Z",
    },

    {
        id: "doc-1d",
        title: "Forensic Signature Examination Report — CFSL Delhi",
        description: "CFSL report resolving forged board resolutions and loan guarantee documents.",
        status: "success",
        document_type: "image",
        object_key: "doc-1d/cfsl_handwriting_report_singhal.pdf",
        extracted_information: {
            document_type: "Forensic Laboratory Examination",
            fir_number: "101/2026",
            accused: [
                { name: "Rajiv Singhal", alias: "", role: "Forger" },
                { name: "Meera Kulkarni", alias: "", role: "Attesting Witness" },
            ],
            narrative: "Forensic Document Division CFSL Delhi analyzed questioned signatures (Q1-Q8) on INR 48.5 Cr credit guarantee documents against specimen signatures of victim Sunil Narang (S1-S20). High-resolution spectral comparison proves simulated freehand forgery executed by Rajiv Singhal.",
            transcribed_text: "CFSL Delhi Opinion: The questioned signatures marked Q1 through Q8 show hesitations, pen lifts, and tremor inconsistent with genuine writing of Sunil Narang. Conclusive proof of simulated forgery.",
            confidence: 0.99,
        },
        case_id: "case-1",
        created_at: "2026-09-04T12:00:00Z",
        updated_at: "2026-09-04T12:00:00Z",
    },
{
        id: "doc-4",
        title: "FIR 44/2026 Cybercrime Complaint",
        description: "FIR for targeted ransomware attack on TechVault Solutions using LockBit 3.0 with insider assistance.",
        status: "success",
        document_type: "text",
        object_key: "doc-4/fir_44_2026_cybercrime.pdf",
        extracted_information: {
            document_type: "First Information Report",
            fir_number: "44/2026",
            district: "Cyber Crime, Gurugram",
            police_station: "Cyber Cell Gurugram",
            incident_datetime: "2026-08-31 03:14",
            place_of_occurrence: "TechVault Solutions Server Farm, DLF Cyber Hub Tower 3, Gurugram",
            complainant: { name: "CISO Ankita Sharma" },
            accused: [
                { name: "Phantom_Cobra (Dmitry Volkov)", alias: "Phantom_Cobra", role: "Ransomware Operator & C2 Admin" },
                { name: "Dev Anand Mishra", alias: "Insider", role: "Rogue System Administrator" },
                { name: "Meena Kapoor", alias: "Digital_Serpent", role: "Money Mule & Crypto Converter" },
                { name: "Saurabh Tiwari", alias: "x_access_king", role: "Dark Web Broker" },
            ],
            acts_and_sections: [
                { act: "IT Act", section: "66", statute: "Computer Related Offences" },
                { act: "IT Act", section: "43", statute: "Unauthorized Access" },
                { act: "BNS", section: "318(4)", statute: "Extortion via Cyber Means" },
                { act: "BNS", section: "336", statute: "Forgery of Digital Instruments" },
            ],
            narrative: "Targeted ransomware attack using LockBit 3.0 on TechVault Solutions server farm. 47 database servers encrypted. Ransom demand: 15 BTC (~INR 7.2 Crore). Insider Dev Anand Mishra provided VPN credentials. Cryptocurrency routed through Tornado Cash mixer to Ethereum wallet 0xAB7...9F21 (Meena Kapoor). C2 server traced to Moldova.",
            transcribed_text: "FIR 44/2026 Cybercrime. LockBit 3.0 ransomware. 47 servers encrypted. 15 BTC ransom demand. Insider threat Dev Anand Mishra. VPN credential leak. Tornado Cash mixer. Meena Kapoor money mule. C2 server Moldova.",
            confidence: 0.96,
        },
        case_id: "case-2",
        created_at: "2026-09-02T11:30:00Z",
        updated_at: "2026-09-02T11:30:00Z",
    },

    {
        id: "doc-5",
        title: "Server Access Logs & IOC Report",
        description: "Forensic analysis of compromised server access logs showing C2 beacon patterns and lateral movement.",
        status: "success",
        document_type: "text",
        object_key: "doc-5/server_logs_ioc_report.txt",
        extracted_information: {
            document_type: "Digital Forensic Log Analysis",
            fir_number: "44/2026",
            incident_datetime: "2026-08-31 03:14",
            total_events: 12483,
            suspicious_ips: 14,
            c2_server_ip: "185.220.101.42 (Moldova, Chisinau)",
            lateral_movement_nodes: 12,
            compromised_accounts: 3,
            accused: [
                { name: "Dev Anand Mishra", alias: "Insider", role: "VPN Credential Source" },
                { name: "Phantom_Cobra (Dmitry Volkov)", alias: "Phantom_Cobra", role: "Remote Attacker" },
            ],
            narrative: "Log analysis reveals initial access at 03:14 IST via VPN credentials of Dev Anand Mishra. Cobalt Strike beacon to C2 at 185.220.101.42. Lateral movement through 12 nodes using PsExec and WMI. LockBit 3.0 deployed at 06:22 IST across 47 servers. 2.3 TB data exfiltrated.",
            transcribed_text: "Server logs 12,483 events. 14 suspicious IPs. C2 beacon 185.220.101.42 Moldova. Initial access Dev Anand Mishra VPN. Cobalt Strike lateral movement 12 nodes. LockBit 3.0 deployed 06:22 IST. 2.3 TB exfiltrated.",
            confidence: 0.98,
        },
        case_id: "case-2",
        created_at: "2026-09-03T09:00:00Z",
        updated_at: "2026-09-03T09:00:00Z",
    },

    {
        id: "doc-6",
        title: "Cryptocurrency Tracing — Tornado Cash Flows",
        description: "Blockchain forensic report tracing ransom payments through Tornado Cash mixer and conversion to fiat.",
        status: "success",
        document_type: "text",
        object_key: "doc-6/crypto_tracing_tornado_cash.pdf",
        extracted_information: {
            document_type: "Blockchain Forensic Report",
            fir_number: "44/2026",
            incident_datetime: "2026-09-01 14:30",
            accused: [
                { name: "Meena Kapoor", alias: "Digital_Serpent", role: "Crypto Conversion Operator & Money Mule" },
                { name: "Phantom_Cobra (Dmitry Volkov)", alias: "Phantom_Cobra", role: "Ransom Wallet Operator" },
            ],
            narrative: "15 BTC ransom deposited to wallet bc1q7x94dp3kf4kzq. 8 UTXO hops through Wasabi CoinJoin and Tornado Cash. Meena Kapoor converted INR 3.8 Crore via WazirX with forged PAN. Remaining 7.2 BTC to Seychelles cold storage.",
            transcribed_text: "BTC ransom wallet bc1q7x94dp3kf4kzq. 15 BTC. 8 UTXO hops Wasabi CoinJoin. Tornado Cash mixer. Meena Kapoor INR 3.8 Cr via WazirX. 7.2 BTC Seychelles cold storage.",
            confidence: 0.94,
        },
        case_id: "case-2",
        created_at: "2026-09-04T11:00:00Z",
        updated_at: "2026-09-04T11:00:00Z",
    },

    {
        id: "doc-6b",
        title: "Dark Web Forum Intelligence — Initial Access Sale",
        description: "OSINT intelligence report documenting sale of TechVault VPN credentials on dark web forum.",
        status: "success",
        document_type: "text",
        object_key: "doc-6b/darkweb_forum_intel.pdf",
        extracted_information: {
            document_type: "OSINT Intelligence Report",
            fir_number: "44/2026",
            incident_datetime: "2026-08-28 22:00",
            place_of_occurrence: "Dark Web Forum 'BreachForums' (Tor Hidden Service)",
            accused: [
                { name: "Saurabh Tiwari", alias: "x_access_king", role: "Initial Access Broker" },
                { name: "Dev Anand Mishra", alias: "Insider", role: "Credential Source" },
            ],
            narrative: "Forum post by 'x_access_king' (Saurabh Tiwari, Noida) offering corporate VPN access for 0.5 BTC. Buyer: Phantom_Cobra. Credentials traced to Dev Anand Mishra (TV-SRE-4412).",
            transcribed_text: "BreachForums listing by x_access_king selling VPN credentials for TechVault. 0.5 BTC. Buyer Phantom_Cobra. Credentials from Dev Anand Mishra TV-SRE-4412.",
            confidence: 0.91,
        },
        case_id: "case-2",
        created_at: "2026-09-05T14:00:00Z",
        updated_at: "2026-09-05T14:00:00Z",
    },

    {
        id: "doc-6c",
        title: "Email Communications — Insider Warning Flags",
        description: "Recovered email communications showing insider coordination and suspicious access pattern warnings.",
        status: "success",
        document_type: "text",
        object_key: "doc-6c/email_communications_whistleblower.pdf",
        extracted_information: {
            document_type: "Email Communication Records",
            fir_number: "44/2026",
            incident_datetime: "2026-08-29 09:15",
            place_of_occurrence: "TechVault Solutions Internal Email Server",
            accused: [
                { name: "Dev Anand Mishra", alias: "Insider", role: "Rogue System Administrator" },
            ],
            narrative: "SOC analyst flagged 14 anomalous VPN logins from Ukrainian subnet 5.39.x.x for Dev Anand Mishra (Aug 25-30). Privilege escalation request 3 days before attack. Unauthorized schema export queries detected. CISO escalation filed.",
            transcribed_text: "SOC alert: Dev Anand Mishra 14 anomalous VPN logins Ukrainian IP 5.39.x.x. Privilege escalation 3 days pre-attack. Unauthorized schema exports. CISO escalation.",
            confidence: 0.93,
        },
        case_id: "case-2",
        created_at: "2026-09-06T10:00:00Z",
        updated_at: "2026-09-06T10:00:00Z",
    },

    // ═══════════════════════════════════════════════════════════════
    // ▌ Case 3 — NCR 12/2026: Local Commercial Inventory Dispute
    // ═══════════════════════════════════════════════════════════════

    {
        id: "doc-7",
        title: "NCR 12/2026 Non-Cognizable Report",
        description: "Non-Cognizable Report for commercial inventory dispute at Karol Bagh Textile Market.",
        status: "success",
        document_type: "text",
        object_key: "doc-7/ncr_12_2026_karolbagh.pdf",
        extracted_information: {
            document_type: "Non-Cognizable Report",
            fir_number: "NCR 12/2026",
            district: "Central Delhi",
            police_station: "Karol Bagh",
            incident_datetime: "2026-08-28 14:00",
            place_of_occurrence: "Karol Bagh Textile Market, Godown No. 7, Central Delhi",
            complainant: { name: "Priya Malhotra" },
            accused: [
                { name: "Rohit Aggarwal", alias: "", role: "Former Business Partner & Defaulting Debtor" },
                { name: "Santosh Kumar Jha", alias: "", role: "Commission Agent & Middleman" },
            ],
            acts_and_sections: [
                { act: "BNS", section: "316(1)", statute: "Breach of Trust" },
                { act: "BNS", section: "318(1)", statute: "Simple Extortion" },
            ],
            narrative: "Rohit Aggarwal misappropriated textile inventory worth INR 18.5 Lakh from shared godown at Karol Bagh Market. Santosh Kumar Jha acted as unauthorized commission agent facilitating off-books sales. CCTV footage shows Aggarwal removing inventory at night (Aug 25-27). Bank records show Jha receiving cash commission payments.",
            transcribed_text: "NCR 12/2026 PS Karol Bagh. Complainant Priya Malhotra. Accused Rohit Aggarwal misappropriated INR 18.5 Lakh textile inventory. Santosh Kumar Jha unauthorized commission agent. CCTV evidence. Cash commission payments.",
            confidence: 0.92,
        },
        case_id: "case-3",
        created_at: "2026-09-03T14:20:00Z",
        updated_at: "2026-09-03T14:20:00Z",
    },

    {
        id: "doc-8",
        title: "Contract Agreement — KBM Textiles Partnership",
        description: "Original partnership agreement establishing shared godown rights and inventory disposal restrictions.",
        status: "success",
        document_type: "image",
        object_key: "doc-8/contract_agreement_kbm.pdf",
        extracted_information: {
            document_type: "Partnership Agreement",
            fir_number: "NCR 12/2026",
            incident_datetime: "2025-04-12 10:00",
            place_of_occurrence: "Notary Office, Rajouri Garden, New Delhi",
            accused: [
                { name: "Rohit Aggarwal", alias: "", role: "Business Partner (Party B)" },
            ],
            narrative: "Partnership agreement 12-04-2025. Priya Malhotra (Party A) and Rohit Aggarwal (Party B). Clause 7.2 restricts unilateral inventory disposal. Clause 9.1 mandates 30-day reconciliation. Aggarwal's alleged actions violate Clauses 7.2 and 9.1.",
            transcribed_text: "Partnership agreement 12-04-2025. Parties: Priya Malhotra (A), Rohit Aggarwal (B). Clause 7.2: no unilateral disposal. Clause 9.1: monthly reconciliation. Registered Sub-Registrar Rajouri Garden.",
            confidence: 0.95,
        },
        case_id: "case-3",
        created_at: "2026-09-03T15:00:00Z",
        updated_at: "2026-09-03T15:00:00Z",
    },

    {
        id: "doc-8b",
        title: "CCTV Footage Report — Godown Surveillance",
        description: "Analysis of CCTV footage from Godown No. 7 showing unauthorized inventory removal over 3 nights.",
        status: "success",
        document_type: "video",
        object_key: "doc-8b/cctv_godown_karolbagh.mp4",
        extracted_information: {
            document_type: "CCTV Surveillance Report",
            fir_number: "NCR 12/2026",
            incident_datetime: "2026-08-25 23:15",
            place_of_occurrence: "Godown No. 7, Karol Bagh Textile Market",
            accused: [
                { name: "Rohit Aggarwal", alias: "", role: "Unauthorized Inventory Removal" },
                { name: "Santosh Kumar Jha", alias: "", role: "Loading Supervisor" },
            ],
            vehicles: [{ plate: "DL-7C-4455", registration: "DL-7C-4455", make: "Tata Ace (White)" }],
            narrative: "CCTV from 3 cameras at Godown No. 7. Aug 25 23:15: Rohit Aggarwal arrives in Tata Ace DL-7C-4455. 14 bales loaded with Santosh Jha supervising. Aug 26: 8 bales removed. Aug 27: 6 bales. Total: 28 bales (~INR 18.5 Lakh).",
            transcribed_text: "CCTV Godown 7 Karol Bagh. 3 cameras. Aug 25 23:15 Rohit Aggarwal Tata Ace DL-7C-4455. 28 bales over 3 nights. Santosh Jha supervising. INR 18.5 Lakh value.",
            confidence: 0.94,
        },
        case_id: "case-3",
        created_at: "2026-09-04T09:00:00Z",
        updated_at: "2026-09-04T09:00:00Z",
    },

    {
        id: "doc-8c",
        title: "Bank Records — Commission Payments to Jha",
        description: "PNB cash deposit records showing Santosh Kumar Jha receiving 10% commission for unauthorized sales.",
        status: "success",
        document_type: "text",
        object_key: "doc-8c/bank_commission_payments_jha.csv",
        extracted_information: {
            document_type: "Bank Statement / Transaction Records",
            fir_number: "NCR 12/2026",
            incident_datetime: "2026-08-28 12:00",
            account_number: "5501992340",
            bank_name: "Punjab National Bank",
            account_holder: "Santosh Kumar Jha",
            total_deposits: 185000,
            total_transactions: 4,
            accused: [
                { name: "Santosh Kumar Jha", alias: "", role: "Commission Agent (Unauthorized)" },
            ],
            narrative: "PNB A/c 5501992340 (Santosh Kumar Jha). 4 cash deposits Aug 26-28: INR 45,000, INR 52,000, INR 48,000, INR 40,000. Total INR 1,85,000 (~10% commission). Deposits coincide with CCTV-documented removal dates.",
            transcribed_text: "PNB A/c 5501992340 Santosh Kumar Jha. 4 deposits Aug 26-28. Total INR 1,85,000. 10% commission on stolen inventory.",
            confidence: 0.96,
        },
        case_id: "case-3",
        created_at: "2026-09-04T11:00:00Z",
        updated_at: "2026-09-04T11:00:00Z",
    },
// -------------------------------------------------------------
    // Case 4 - FIR 108/2026: Kashmere Gate Interstate Hawala Syndicate
    // -------------------------------------------------------------

    {
        id: "doc-kg-1",
        title: "FIR 108/2026 First Information Report",
        description: "FIRST INFORMATION REPORT (Under Section 173 BNSS, 2023). District: North Delhi. PS: Kashmere Gate. FIR No: 108/2026.",
        status: "success",
        document_type: "text",
        object_key: "doc-kg-1/fir_108_2026_kashmeregate.txt",
        extracted_information: {
            document_type: "First Information Report",
            fir_number: "108/2026",
            district: "North Delhi",
            police_station: "Kashmere Gate",
            incident_datetime: "2026-03-11 15:30",
            place_of_occurrence: "Kashmere Gate Metro Concourse and Mori Gate Inter-State Bus Terminus",
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
            narrative: "Interstate syndicate executing Hawala cash structuring through Kashmere Gate transit corridor. Rajesh Sharma operating Axis Bank account 4901238910. Vikram Malhotra intercepted driving DL-01-AB-1234 with cash and 12 burner SIMs.",
            transcribed_text: "FIR No: 108/2026 PS Kashmere Gate. Accused Rajesh Sharma operating Axis Bank A/c 4901238910 for structured cash pooling. Vikram Malhotra intercepted driving DL-01-AB-1234. Tariq 'Kabootar' Khan coordinating offshore dispatches from Dubai.",
            confidence: 0.99,
        },
        case_id: "case-4",
        created_at: "2026-03-11T15:30:00Z",
        updated_at: "2026-03-11T15:30:00Z",
    },

    {
        id: "doc-kg-2",
        title: "Axis Bank Structuring Transactions 4901",
        description: "CSV bank statement showing 10 structured cash deposits below INR 50,000 and offshore RTGS transfers.",
        status: "success",
        document_type: "text",
        object_key: "doc-kg-2/axis_bank_structuring_4901.csv",
        extracted_information: {
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
            suspicious_transactions: 10,
            accused: [
                { name: "Vikram Malhotra", alias: "Vicky", role: "Cash Depositor (Smurfing)" },
                { name: "Rajesh Sharma", alias: "Bhaiji", role: "Account Beneficiary" },
            ],
            narrative: "10 structured cash deposits of INR 48,000-49,500 each into Axis Bank A/c 4901238910 within 5-hour window on 2026-03-11, followed by RTGS outward transfer of INR 4,89,000 to Al-Noor Export FZE (Dubai).",
            confidence: 0.99,
        },
        case_id: "case-4",
        created_at: "2026-03-11T10:00:00Z",
        updated_at: "2026-03-11T15:00:00Z",
    },

    {
        id: "doc-kg-3",
        title: "Seizure Memo - Mori Gate Recovery",
        description: "Panchnama / Seizure Memo under Section 105 BSA, 2023 documenting physical recovery at Mori Gate Inter-State Bus Terminus.",
        status: "success",
        document_type: "text",
        object_key: "doc-kg-3/seizure_memo_recovery_morigate.txt",
        extracted_information: {
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
        },
        case_id: "case-4",
        created_at: "2026-03-11T17:30:00Z",
        updated_at: "2026-03-11T17:30:00Z",
    },

    {
        id: "doc-kg-4",
        title: "Wiretap Intercept - Line 9811 Session 4",
        description: "Audio intercept transcript on target line +91-98110-44901 latched to Chandni Chowk Hub tower.",
        status: "success",
        document_type: "voice",
        object_key: "doc-kg-4/wiretap_intercept_line9811.wav",
        extracted_information: {
            document_type: "Audio Intercept / Wiretap",
            fir_number: "108/2026",
            incident_datetime: "2026-03-11 01:15",
            place_of_occurrence: "Chandni Chowk Cell Tower Hub DEL-442",
            accused: [
                { name: "Rajesh Sharma", alias: "Bhaiji", role: "Caller (Target Line +91-98110-44901)" },
                { name: "Tariq 'Kabootar' Khan", alias: "Kabootar", role: "Recipient (+971-50-998-1294, Dubai)" },
            ],
            narrative: "Intercepted call discussing cash delivery at Mori Gate in White Creta DL-01-AB-1234 and 10 structuring deposits into Axis Bank 4901238910.",
            confidence: 0.98,
        },
        case_id: "case-4",
        created_at: "2026-03-11T01:15:00Z",
        updated_at: "2026-03-11T01:15:00Z",
    },

    {
        id: "doc-kg-5",
        title: "CCTV ANPR - Kashmere Gate Toll Cam04",
        description: "Automated plate reader footage log capturing vehicle DL-01-AB-1234 moving South at 62.4 km/h.",
        status: "success",
        document_type: "video",
        object_key: "doc-kg-5/cctv_anpr_kashmeregate_cam04.mp4",
        extracted_information: {
            document_type: "CCTV ANPR Video Telemetry",
            fir_number: "108/2026",
            incident_datetime: "2026-03-11 02:42",
            place_of_occurrence: "Kashmere Gate Flyover & Mori Gate Junction",
            vehicles: [{ plate: "DL-01-AB-1234", make: "Hyundai Creta (White)" }],
            narrative: "ANPR camera DL-DEL-KG-FLY-CAM04 captured White Hyundai Creta DL-01-AB-1234 moving South towards Mori Gate.",
            confidence: 0.97,
        },
        case_id: "case-4",
        created_at: "2026-03-11T02:42:00Z",
        updated_at: "2026-03-11T02:42:00Z",
    },

    {
        id: "doc-kg-6",
        title: "Biometric Forensic Dossier - Imran Qureshi",
        description: "CFSL AFIS 10-print biometric report establishing counterfeit Aadhaar 'Rakesh Verma' belongs to Imran Qureshi.",
        status: "success",
        document_type: "image",
        object_key: "doc-kg-6/bio_forensic_imran.pdf",
        extracted_information: {
            document_type: "Biometric Forensic Dossier",
            fir_number: "108/2026",
            incident_datetime: "2026-03-11 18:00",
            place_of_occurrence: "CFSL Central Forensic Science Laboratory",
            accused: [
                { name: "Imran Qureshi", alias: "Chhota Imran / Rakesh Verma", role: "Syndicate Enforcer" },
            ],
            narrative: "AFIS 10-print biometric match (98.4%) establishing suspect carried forged Aadhaar under 'Rakesh Verma'.",
            confidence: 0.98,
        },
        case_id: "case-4",
        created_at: "2026-03-11T18:00:00Z",
        updated_at: "2026-03-11T18:00:00Z",
    },
];

const delay = (ms = 400) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// ▌ Public service functions ▌

export async function getDocuments(
    caseId?: string
): Promise<Document[]> {
    await delay();

    if (!caseId) {
        return [...mockDocuments];
    }

    return mockDocuments.filter(
        (document) => document.case_id === caseId
    );
}

export async function getDocument(id: string): Promise<Document> {
    await delay();

    const document = mockDocuments.find((d) => d.id === id);

    if (!document) {
        throw new Error("Document not found");
    }

    return { ...document };
}

export async function deleteDocument(
    id: string
): Promise<{ message: string }> {
    await delay();

    const exists = mockDocuments.some((d) => d.id === id);

    if (!exists) {
        throw new Error("Document not found");
    }

    mockDocuments = mockDocuments.filter((d) => d.id !== id);

    return { message: `Document ${id} deleted` };
}

export async function getDownloadUrl(
    id: string
): Promise<{ download_url: string }> {
    await delay();

    const document = mockDocuments.find((d) => d.id === id);

    if (!document) {
        throw new Error("Document not found");
    }

    // Use a real public PDF so the iframe actually renders something
    return {
        download_url:
            "https://imgv2-1-f.scribdassets.com/img/document/407102441/original/e5460cd1ad/1?v=1",
    };
}

// ▌ Helpers used by mock/upload.ts ▌

/** Add a document to the mock store (used when a new upload is initiated). */
export function addMockDocument(doc: Document): void {
    mockDocuments = [...mockDocuments, doc];
}

/** Retrieve a document synchronously (used by confirmUpload). */
export function getMockDocument(id: string): Document {
    const doc = mockDocuments.find((d) => d.id === id);
    if (!doc) throw new Error("Document not found");
    return { ...doc };
}

/** Update a document's status in-place (used by confirmUpload to simulate processing). */
export function updateMockDocumentStatus(
    id: string,
    status: DocumentStatus
): void {
    mockDocuments = mockDocuments.map((d) =>
        d.id === id
            ? { ...d, status, updated_at: new Date().toISOString() }
            : d
    );
}
