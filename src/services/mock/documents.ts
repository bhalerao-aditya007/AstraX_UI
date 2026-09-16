import type { Document, DocumentStatus } from "../documents";

const now = new Date().toISOString();

let mockDocuments: Document[] = [
    // ═══════════════════════════════════════════════════════════════
    // ▌ Case 1 — FIR 101/2026: Apex Financial Syndicate Investigation
    // ═══════════════════════════════════════════════════════════════

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
            place_of_occurrence: "Vasant Kunj Commercial Complex & Dwarka Sector-21 Industrial Zone",
            complainant: { name: "DSP Meera Bhat" },
            accused: [
                { name: "Rajesh Sharma", alias: "Bhaiji", role: "Hawala Operator & Syndicate Coordinator" },
                { name: "Vikram Malhotra", alias: "Vicky", role: "Cash Courier & Logistics Driver" },
                { name: "Tariq 'Kabootar' Khan", alias: "Kabootar", role: "Syndicate Kingpin & Offshore Dispatcher" },
                { name: "Sunil Narang", alias: "", role: "Complainant / Victim" },
            ],
            acts_and_sections: [
                { act: "BNS", section: "111", statute: "Organized Crime Syndicate" },
                { act: "BNS", section: "316(2)", statute: "Criminal Breach of Trust" },
                { act: "PMLA", section: "3", statute: "Money Laundering" },
                { act: "IT Act", section: "66D", statute: "Cheating by Impersonation" },
            ],
            vehicles: [{ plate: "DL-01-AB-1234", registration: "DL-01-AB-1234", make: "Hyundai Creta (White)" }],
            narrative: "Apex Logistics LLC incorporated using forged Aadhaar cards. Complainant Sunil Narang induced to transfer INR 5 Crore advance into HDFC A/C 9901 on fraudulent bill of lading. Funds layered via ICICI A/C 4521, converted to 14.2 BTC via P2P crypto gateway, routed through Wasabi peel chain mixer to UAE destinations.",
            transcribed_text: "FIR No: 101/2026 PS Vasant Kunj. Accused Rajesh Sharma operating Axis Bank A/c 4901238910 for structured cash pooling. Vikram Malhotra intercepted driving DL-01-AB-1234. Tariq 'Kabootar' Khan coordinating offshore dispatches from Dubai.",
            confidence: 0.97,
        },
        case_id: "case-1",
        created_at: "2026-09-01T10:00:00Z",
        updated_at: "2026-09-01T10:00:00Z",
    },

    {
        id: "doc-2",
        title: "Axis Bank Structuring Transactions 4901238910",
        description: "CSV bank statement showing 12 structured cash deposits below INR 50,000 and offshore RTGS transfers.",
        status: "success",
        document_type: "text",
        object_key: "doc-2/axis_bank_structuring_4901.csv",
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
            narrative: "12 structured cash deposits of INR 48,000-49,500 each into Axis Bank A/c 4901238910 across CDM/ATM and branch channels within 5-hour window on 2026-08-31. Immediately followed by RTGS outward transfer of INR 4,89,000 to Al-Noor Export FZE (Dubai). Classic sub-threshold smurfing pattern designed to evade PMLA automated reporting.",
            transcribed_text: "Transaction records from Axis Bank A/c 4901238910 showing 10 STRUCTURING_ALERT flagged deposits by Vikram Malhotra to Rajesh Sharma (INR 49k each) followed by OFFSHORE_LAYERING RTGS transfer to Al-Noor Export FZE.",
            confidence: 0.99,
        },
        case_id: "case-1",
        created_at: "2026-09-02T08:00:00Z",
        updated_at: "2026-09-08T11:45:00Z",
    },

    {
        id: "doc-3",
        title: "Seizure Memo — Dwarka Warehouse Raid",
        description: "Panchnama / Seizure Memo under Section 105 BSA, 2023 documenting physical recovery at Dwarka Sector-21 warehouse.",
        status: "success",
        document_type: "text",
        object_key: "doc-3/seizure_memo_dwarka_warehouse.pdf",
        extracted_information: {
            document_type: "Seizure Memo / Panchnama",
            fir_number: "101/2026",
            district: "South-West Delhi",
            police_station: "Vasant Kunj",
            incident_datetime: "2026-09-02 04:30",
            place_of_occurrence: "Dwarka Sector-21 Industrial Zone, Delhi",
            accused: [
                { name: "Vikram Malhotra", alias: "Vicky", role: "Cash Courier & Driver" },
                { name: "Imran Qureshi", alias: "Chhota Imran", role: "Syndicate Enforcer" },
            ],
            witnesses: ["Panch Witness 1: Ramesh Kumar", "Panch Witness 2: Sushma Devi"],
            seized_items: [
                "1x White Hyundai Creta (DL-01-AB-1234)",
                "Cash INR 24,50,000 in Rs 500 bundles",
                "Pre-filled Axis Bank deposit slips (A/c 4901238910)",
                "2x Samsung Galaxy smartphones",
                "12x unactivated prepaid SIM cards",
                "Forged Aadhaar card — Imran Qureshi as 'Sunil Verma'",
                "1x MacBook Pro with encrypted AES-256 ledger files",
            ],
            vehicles: [{ plate: "DL-01-AB-1234", registration: "DL-01-AB-1234", make: "Hyundai Creta (White)" }],
            narrative: "Vehicle interception near G.T. Road / Dwarka Sector-21. Officers recovered INR 24.5 lakh in structured currency bundles, pre-filled deposit vouchers targeting Axis Bank A/c 4901238910, 2 smartphones with Signal app communications, 12 burner SIM cards with forged KYC documentation, and a counterfeit Aadhaar card.",
            transcribed_text: "PANCHNAMA FIR 101/2026. Seizure at Dwarka warehouse. Vehicle DL-01-AB-1234 Hyundai Creta seized. Cash INR 24,50,000. Structured deposit slips Axis Bank 4901238910. Forged Aadhaar card Imran Qureshi as 'Sunil Verma'. MacBook encrypted ledgers.",
            confidence: 0.98,
        },
        case_id: "case-1",
        created_at: "2026-09-02T05:00:00Z",
        updated_at: "2026-09-02T05:00:00Z",
    },

    {
        id: "doc-1b",
        title: "Wiretap Intercept — Rajesh-Tariq Session",
        description: "Audio intercept transcript of coded conversation between syndicate coordinator and offshore kingpin.",
        status: "success",
        document_type: "voice",
        object_key: "doc-1b/wiretap_rajesh_tariq_session.wav",
        extracted_information: {
            document_type: "Audio Intercept Transcript",
            fir_number: "101/2026",
            incident_datetime: "2026-08-31 01:15",
            place_of_occurrence: "Cellular intercept: Tower Chandni Chowk Hub",
            accused: [
                { name: "Rajesh Sharma", alias: "Bhaiji", role: "Hawala Operator" },
                { name: "Tariq 'Kabootar' Khan", alias: "Kabootar", role: "Syndicate Kingpin" },
            ],
            narrative: "Coded conversation intercepted on +91-98110-44901. Rajesh Sharma confirms collection of '24.5 peti' cash at Mori Gate terminal. Tariq Khan instructs structured deposits of INR 49,000 each into Axis Bank A/c 4901238910 to avoid PMLA alerts. Immediate RTGS to Dubai export firm Al-Noor planned.",
            transcribed_text: "Speaker 1 (Rajesh): '24.5 peti cash collected at Mori Gate terminal.' Speaker 2 (Tariq): 'Single deposit 50k se upar mat daalna. PMLA trigger ho jayega. 49-49k ke vouchers bana ke Axis account 4901238910 mein struct karo.'",
            confidence: 0.96,
        },
        case_id: "case-1",
        created_at: "2026-09-01T14:00:00Z",
        updated_at: "2026-09-01T14:00:00Z",
    },

    {
        id: "doc-1c",
        title: "CCTV ANPR — Vasant Kunj Flyover Capture",
        description: "Automated plate reader capture of suspect vehicle at Vasant Kunj flyover toll point.",
        status: "success",
        document_type: "video",
        object_key: "doc-1c/cctv_anpr_vasantkunj_cam08.mp4",
        extracted_information: {
            document_type: "CCTV / ANPR Telemetry",
            fir_number: "101/2026",
            incident_datetime: "2026-08-31 02:42",
            place_of_occurrence: "Vasant Kunj Flyover Toll Point, South-West Delhi",
            accused: [
                { name: "Vikram Malhotra", alias: "Vicky", role: "Driver" },
                { name: "Imran Qureshi", alias: "Chhota Imran", role: "Front Passenger" },
            ],
            vehicles: [{ plate: "DL-01-AB-1234", registration: "DL-01-AB-1234", make: "Hyundai Creta (White)" }],
            narrative: "YOLOv8 detection at Camera DL-DEL-VK-FLY-CAM08. Vehicle DL-01-AB-1234 (Hyundai Creta White) captured at 62.4 km/h heading south. Occupant 1 (Driver): 91.4% match Vikram Malhotra. Occupant 2: 88.7% match Imran Qureshi. Silver Samsonite briefcase detected in rear compartment.",
            transcribed_text: "ANPR Plate DL-01-AB-1234 Hyundai Creta White. Speed 62.4 km/h. Occupant 1 match 91.4% Vikram Malhotra. Occupant 2 match 88.7% Imran Qureshi.",
            confidence: 0.95,
        },
        case_id: "case-1",
        created_at: "2026-09-01T16:00:00Z",
        updated_at: "2026-09-01T16:00:00Z",
    },

    {
        id: "doc-1d",
        title: "Biometric Forensic Report — Imran Qureshi",
        description: "CFSL fingerprint and facial recognition comparison report resolving forged identity.",
        status: "success",
        document_type: "image",
        object_key: "doc-1d/bio_forensic_imran_report.pdf",
        extracted_information: {
            document_type: "Biometric Forensic Report",
            fir_number: "101/2026",
            accused: [
                { name: "Imran Qureshi", alias: "Chhota Imran", role: "Syndicate Enforcer & Counterfeit ID Carrier" },
            ],
            narrative: "CFSL Report CFSL/DEL/BIO/2026/894. AFIS fingerprint match 94.8% (14 minutiae points) confirmed identity as Imran Qureshi (Dossier CR-DEL-2024-4490). Forged Aadhaar card under name 'Sunil Verma' resolved. De-duplication confidence 96.2%.",
            transcribed_text: "Biometric match: Imran Qureshi 94.8% AFIS fingerprint. Forged Aadhaar 'Sunil Verma' RESOLVED. De-duplication confidence 96.2%.",
            confidence: 0.97,
        },
        case_id: "case-1",
        created_at: "2026-09-05T09:00:00Z",
        updated_at: "2026-09-05T09:00:00Z",
    },

    // ═══════════════════════════════════════════════════════════════
    // ▌ Case 2 — FIR 44/2026: Cybercrime Ransomware Investigation
    // ═══════════════════════════════════════════════════════════════

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
