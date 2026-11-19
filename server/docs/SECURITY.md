# SahaayaLearn Security & Child Data Protection

## Regulatory Compliance
SahaayaLearn is engineered in accordance with India's **Digital Personal Data Protection Act, 2023 (DPDP)** and **DPDP Rules, 2025** regarding the processing of children's data.

---

## Non-Negotiable Child Privacy Rules
1. **No Voiceprints or Biometric Tracking:** Spoken audio is processed solely for active session transcription and is discarded immediately after synthesis unless explicitly consented for quality assurance.
2. **No Behavioral Advertising:** Student profiles are strictly isolated from third-party advertising networks or commercial data brokers.
3. **Verified Guardian Consent:** Guardian relationships are verified before access to student learning summaries is granted (`guardian_links` and `consent_records`).
4. **Data Minimization:** No residential addresses, schools, or government identifiers are required to use the personal companion.
5. **Private Credentials:** All Gemini and Sarvam AI provider keys reside exclusively in server-side environment variables and are never sent to the client browser.
6. **Row Level Security (RLS):** Enforced at the PostgreSQL database layer, preventing access to another student's learning history.
