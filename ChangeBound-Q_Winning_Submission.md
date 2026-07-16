# ChangeBound-Q — FinSpark'26 Winning Submission Pack

**Problem Statement 1: Privileged Access Misuse & Insider Threat Detection**
**Deadline: prototype submission closes 16 July 2026 (TODAY). Evaluation Round 2: 16–17 July.**

---

# PART A — What changed from the hostile-review version, and why it now wins

Your hostile review was correct analysis but losing packaging. Seven strategic fixes:

## Fix 1 — Name the gap. Own a concept.

Judges remember named problems. The pitch now leads with:

> **The Approval-to-Action Gap.** Banks verify WHO can access (PAM) and record WHAT happened (SIEM/DAM). No system verifies, in real time, that what a privileged user actually did matches what was approved. Insider misuse lives in that gap.

The PNB–Nirav Modi fraud (₹14,000+ crore, 2018) is the anchor story for Bank of Maharashtra / IBA / DFS judges: shared SWIFT privileged credentials, transactions issued with no linkage to any approved, recorded business authorization — for **seven years**. That was not a missing firewall. It was a missing approval-to-action correlation. *(Verify the figure before presenting; ~₹13,000–14,000 crore is the commonly cited range.)*

## Fix 2 — Score all six expected outcomes explicitly.

Hackathon judges score against the problem statement's bullet list. The hostile review demoted AI and PQC to "ancillary" — intellectually honest, competitively fatal, because "AI-driven behavioural analysis," "risk-based access control," and "QPC" are three of the six explicit expected outcomes. The winning version keeps your engineering honesty but makes all six outcomes **first-class and visible in the demo**:

| PS1 Expected Outcome | ChangeBound-Q feature (demoed live) |
|---|---|
| Detects misuse of privileged accounts | Approval-to-action drift engine: wrong target, outside window, cancelled ticket, out-of-class DDL, no-ticket session |
| Identifies insider threats in real time | Live session correlation; unlinked/direct DB sessions flagged UNAPPROVED within seconds |
| AI-driven behavioural analysis | Per-session risk score from time/device/target/volume/sequence features, with plain-English explanations |
| Risk-based access control | **Graduated Containment Ladder** — automated, reversible controls that tighten as risk rises (see Fix 3) |
| Protects critical administrative systems | Zero standing privilege: JIT, pre-reviewed native DB roles, auto-expiry, native denial of out-of-scope operations |
| Quantum-Proof Cryptography for artefacts & credentials | ML-DSA-signed Change Execution Attestations; ML-KEM-wrapped evidence keys and session credentials vs harvest-now-decrypt-later |

## Fix 3 — The Graduated Containment Ladder (this is your risk-based access control).

The hostile review said "AI may not block." Correct — so reframe it as a designed feature, not a limitation:

> **AI never convicts. AI escalates.** Hard stops are deterministic (native entitlements). Risk-based response is graduated and reversible.

| Level | Trigger | Automated response | Reversible? |
|---|---|---|---|
| L0 | Baseline | Standard logging | — |
| L1 | Mild anomaly | Enhanced session recording, analyst case opened | Yes |
| L2 | Moderate anomaly | Step-up MFA challenge mid-session | Yes |
| L3 | High anomaly | Session TTL shortened; optional scopes withdrawn | Yes |
| L4 | Severe anomaly | Session quarantined to read-only entitlement | Yes |
| L5 | Confirmed by human | Analyst one-click revoke (human decision, one click) | Human-owned |

This is *more* sophisticated than "AI blocks bad guys" — it's automated risk-based access control that can never cause a production outage from a false positive. Say exactly that sentence to judges.

## Fix 4 — Fail-safe by architecture (kills the biggest objection).

Because enforcement is delegated to **native PostgreSQL roles with expiry**, ChangeBound-Q's own failure can never lock administrators out:

- Control plane dies → already-granted JIT roles keep working until natural expiry; break-glass is untouched; only *new* automated grants pause (fallback: existing manual grant process).
- This is the opposite of an inline gateway: **it cannot become an outage weapon.** NIST SP 800-207's PEP-availability concern doesn't apply because there is no inline PEP in the critical path.

Headline this on the Differentiators slide: *"The only insider-threat control whose total failure cannot stop bank operations."*

## Fix 5 — PQC mapped 1:1 to the problem statement's own words.

PS1 says: *"Incorporates QPC to secure sensitive artefacts and credentials."* Your PQC story is now exactly that, with a real threat model:

- **Threat: harvest-now-decrypt-later.** RBI requires long retention of audit/fraud evidence. Privileged session recordings contain credentials, PII, and schema intelligence. An adversary who exfiltrates today's encrypted evidence archive decrypts it when a cryptographically relevant quantum computer arrives.
- **Artefacts:** every Change Execution Attestation is signed with **ML-DSA-65** (FIPS 204); evidence bundles encrypted AES-256-GCM with DEKs wrapped via **ML-KEM-768** (FIPS 203).
- **Credentials:** the JIT temporary DB credential is delivered to the session broker under an ML-KEM-established key.
- **Crypto-agility layer:** algorithms are pluggable — the exact migration property RBI/SEBI quantum-readiness guidance asks for.
- Honest footnote (say it before they ask): prototype uses liboqs (prototype-grade per its own maintainers); production path is an approved provider with HSM/KMS key lifecycle.

## Fix 6 — India-specific compliance narrative (business relevance ammo).

- **RBI Cyber Security Framework (2016), Annex 1:** banks must implement privileged identity management, centralized audit trails, and alerting on privileged account activity. ChangeBound-Q automates evidence for exactly these controls.
- **RBI Master Directions on IT Governance, Risk, Controls & Assurance (2023):** access control, audit trail integrity, DR-tested critical systems — the shadow-mode, fail-safe design is directly compatible.
- **CERT-In directions:** 6-hour incident reporting. A pre-correlated, signed session timeline turns hours of reconstruction into minutes — a measurable compliance benefit.
- **DPDP Act 2023:** pseudonymized analyst view by default, audited identity reveal, purpose limitation — privacy-by-design, on a slide.
- **Quantum readiness:** SEBI's CSCRF and global regulator signals on PQC migration make the QPC layer forward-compliance, not decoration.

*(Verify clause numbers before the finale; the control themes are accurate.)*

## Fix 7 — Sell what it removes: work and standing risk, not products.

Answer to "which product does the bank remove?" — **none, and that's the point.** It removes:

1. **Standing privilege** (the #1 recurring finding in bank IT audits: dormant privileged accounts, over-broad DBA rights, shared credentials).
2. **Manual reconciliation work** — investigation reconstruction across ITSM + PAM + DB logs drops from hours to seconds (demoed).
3. **Audit-preparation hours** — RBI inspection evidence for privileged access is generated continuously and cryptographically verifiable.

Positioning sentence: *"CyberArk answers 'who can get in.' Guardium answers 'what happened.' ServiceNow answers 'what was approved.' Nobody answers 'did what happened match what was approved?' — ChangeBound-Q is the assurance plane above all three, not a replacement for any of them."*

---

# PART B — The upgraded one-liner and elevator pitch

**Name:** ChangeBound-Q
**Tagline:** *Bind every privileged session to its approved change. Catch drift in real time. Prove it for a decade.*

**Elevator pitch (30 seconds):**

> India's biggest banking frauds weren't hacking — they were trusted insiders using privileged access outside anything that was approved, and no system noticed for years. Banks already have approvals, PAM, and database logs — as disconnected silos. ChangeBound-Q fuses them into one real-time assurance plane: every privileged session is bound to its approved change with the narrowest just-in-time entitlement, enforced natively by the database itself; AI scores behavioural drift and responds with graduated, reversible controls; and every action is sealed into a quantum-safe, tamper-evident Change Execution Attestation. If a session has no approval behind it, the bank knows in seconds — not in seven years.

---

# PART C — Slide-by-slide content (paste into Finspark_Hackathon_Template.pptx)

## Slide 1 — Title
- Team name, member names, date.
- Add the tagline under the title: *"ChangeBound-Q — Quantum-Safe Privileged Session Assurance for Banking. Bind every privileged session to its approved change."*

## Slide 2 — Problem Statement
- **Selected: PS1 — Privileged Access Misuse & Insider Threat Detection.**
- **Why we chose it:** insiders are the hardest adversary — they hold legitimate credentials, so perimeter and signature defenses are blind to them.
- **The Approval-to-Action Gap:** Banks control *who* gets privileged access (PAM) and record *what* happened (SIEM/DAM/ITSM) — but no system verifies in real time that **what a privileged user did matches what was approved**. Investigating one session today means manually stitching ITSM tickets, PAM recordings, and database logs.
- **Anchor:** the PNB fraud ran for ~7 years on shared privileged SWIFT credentials issuing transactions with no linkage to approved authorizations. Global cost of insider risk: ~$17.4M per organization per year (Ponemon/DTEX 2025 — verify figure).
- Close with the 6-outcome mapping table from Part A, Fix 2 (judges score against it — hand it to them).

## Slide 3 — Pre-Requisites
- Structured ITSM change tickets (change class, target, window, approver) — standard in ServiceNow/BMC/JIRA SD deployments.
- Named PAM session records (CyberArk/BeyondTrust or simulated equivalent) with session-ID and user mapping.
- Target database supporting role-based grants + native audit (prototype: PostgreSQL 16 + pgAudit).
- Read access to native DB audit stream; API/webhook access to ITSM and PAM (read-only — shadow mode needs nothing else).
- Synthetic/masked data only; no production data required for pilot.
- **Explicit assumption stated honestly:** pilot targets one standardized workflow (payment-reconciliation DB maintenance); coverage of other paths is declared, not assumed.

## Slide 4 — Tools & Resources
- **Backend:** Python 3.12, FastAPI; PostgreSQL 16 + pgAudit (target system, native enforcement + evidence); Docker Compose.
- **AI/behavioural engine:** scikit-learn (Isolation Forest + per-user baseline features), explainability via feature attribution; deterministic drift rules engine.
- **PQC:** liboqs / oqs-python — ML-KEM-768 (FIPS 203), ML-DSA-65 (FIPS 204); AES-256-GCM evidence encryption (prototype-grade PQC, clearly labeled).
- **Frontend:** React SOC dashboard (session timeline, risk ladder, attestation verifier, coverage map).
- **Simulated integrations:** mock ITSM (ServiceNow-schema tickets), mock PAM session broker.
- **References:** NIST SP 800-207 (Zero Trust), NIST FIPS 203/204, RBI Cyber Security Framework 2016, RBI IT Governance Directions 2023, NIST AI 100-2 (adversarial ML), MITRE ATT&CK insider TTPs.

## Slide 5 — Supporting Functional Documents
- **User flow 1 (happy path):** ticket approved → session brokered → JIT role auto-selected & granted → maintenance executed → role expires → attestation sealed.
- **User flow 2 (drift):** approved session attempts raw customer export → PostgreSQL denies natively → drift event correlated to ticket → case opened at L1.
- **User flow 3 (ghost session):** direct DB connection with no PAM/ticket lineage → flagged UNAPPROVED in seconds → analyst case with full context.
- **Logic flow:** entitlement selection = f(change class → pre-reviewed role catalogue); risk score = f(time, device, target, volume, sequence vs personal + peer baseline); containment level = f(risk score, criticality) — always reversible below L5.
- **Threat model document:** 5 insider playbooks tested (privilege creep, off-hours export, cancelled-ticket reuse, ghost session, within-scope reconnaissance) + declared residual risks (collusion, out-of-band paths).
- Link these as one-page PDFs / repo docs.

## Slide 6 — Key Differentiators & Adoption Plan
**Differentiators:**
1. **Closes the Approval-to-Action Gap** — the correlation no incumbent (PAM, DAM, SIEM, ITSM) performs; we sit above them, not instead of them.
2. **Native enforcement, zero theater** — the database itself denies out-of-scope operations; our demo shows PostgreSQL's denial, not a UI mock.
3. **Fail-safe by architecture** — total failure of ChangeBound-Q cannot stop bank operations (no inline gateway; grants expire naturally; break-glass untouched). *The only insider control whose outage is not an outage.*
4. **Graduated Containment Ladder** — automated risk-based access control that is always reversible below the human-decision level; false positives create friction, never downtime.
5. **Quantum-safe evidence** — attestations signed ML-DSA, evidence keys wrapped ML-KEM; the only entry treating decade-long evidence retention as an HNDL target, exactly matching PS1's QPC wording.
6. **Zero added approval burden** — reuses the existing ticket; the DBA types nothing new.

**Adoption plan (3 phases):** Shadow mode (read-only correlation, measure linkage % and investigation-time savings — zero risk) → Advisory (cases + step-up recommendations to SOC) → Enforce (JIT entitlements on one lower-risk workflow, then expand by workflow). Removable at any phase without touching the protected workflow.

## Slide 7 — GitHub Repository & Diagrams
- Repo link + README with 5-minute docker-compose quickstart.
- Architecture diagram (Slide 14 version), sequence diagram of the happy path, screenshot of drift detection + attestation INVALID tamper demo.
- Badge-style claims: "Native DB denial ✓ | Real PQC (liboqs) ✓ | Ablation study included ✓".

## Slide 8 — Business Potential & Relevance
- **Regulatory pull, not push:** RBI CSF 2016 mandates privileged identity management + audit trails; IT Governance Directions 2023 demand audit-trail integrity; CERT-In demands 6-hour incident reporting — ChangeBound-Q turns all three from manual effort into generated evidence.
- **Market:** 12 PSBs, 21 private banks, ~1,500 UCBs, NBFCs, insurers — every one runs privileged database change management; smaller banks consumable as a managed service (RegTech/SaaS).
- **Quantified value hypotheses (pilot-measurable):** ≥95% automatic session-to-ticket linkage on a standardized workflow; ≥50% median investigation-time reduction; standing privileged entitlements on covered workflow → zero; audit evidence generation → continuous.
- **Expansion path:** PostgreSQL → Oracle/MSSQL → Linux privileged shell sessions → cloud IAM (session policies) → SWIFT-adjacent operational workflows. Attestation format is target-agnostic from day one.
- **Long term:** "assurance plane" becomes the bank's canonical answer to any regulator/auditor question of the form *"prove this privileged action was authorized."*

## Slide 9 — Uniqueness of Approach
1. **Inversion of the industry pattern:** everyone else adds a smarter *gate* (inline proxy, command filter). We add a *binding* — approval ↔ identity ↔ session ↔ entitlement ↔ native evidence — and let the database enforce. No universal SQL parser, no inline point of failure, no bypassable string matching.
2. **AI with defined authority limits:** the model prioritizes and escalates through reversible controls; deterministic policy handles hard stops. We show an **ablation study** (rules only / ML only / combined) — we prove the AI earns its place instead of asserting it.
3. **Honesty as a feature:** the dashboard shows a live **coverage map** — which paths are mediated, observed, or UNKNOWN. Unlinked ≠ assumed approved. No competing entry will tell judges what it *cannot* see; a bank CISO will trust the one that does.
4. **First to treat privileged-session evidence as a quantum target** (HNDL on 10-year retention archives) — a concrete PQC threat model, not a buzzword.

## Slide 10 — User Experience
- **The DBA experiences nothing new.** Same ticket, same PAM checkout, same tools. Zero additional fields, zero per-command approvals. (This is the #1 reason insider-threat tools die: operator revolt. We designed for it.)
- **The SOC analyst gets one screen instead of three consoles:** session timeline with approved-vs-observed diff, risk score with plain-English reasons ("first-ever access to table X at 02:40 from a new device"), one-click containment actions, one-click verifiable attestation export.
- **The auditor gets a verifier:** drop an attestation file in → VERIFIED / GAP / INVALID, with the signature chain and evidence hashes.
- Screenshot each of the three personas' views.

## Slide 11 — Scalability
- **Horizontal by design:** correlation is per-session and stateless between sessions → shard by target system; evidence pipeline is append-only log + object storage (natural scale-out).
- **Catalogue scale:** new workflows onboard by adding a reviewed entitlement template + ticket mapping — configuration, not code. Adapter model per target type (PostgreSQL adapter today; Oracle/cloud IAM adapters share the attestation core).
- **Org scale:** multi-branch/multi-DC works because enforcement is local-native (roles live in each database); the control plane only orchestrates and can be regionally replicated without split-brain risk to enforcement (grants carry their own expiry).
- **Volume honesty:** privileged sessions are thousands/day, not millions/sec — this is a low-QPS, high-value plane; the heavy stream (audit events) is standard log-pipeline engineering.

## Slide 12 — Ease of Deployment & Maintenance
- **Day-1 deploy = read-only:** shadow mode needs API read access to ITSM/PAM and a copy of the DB audit stream. No agent on the database. No change to any workflow. Docker/Kubernetes packaged.
- **Nothing in the critical path:** upgrades and restarts of ChangeBound-Q never interrupt administration (native grants keep working; expiry is enforced by the database).
- **Maintenance surface is small and explicit:** entitlement catalogue (DBA-reviewed, versioned in git), ticket-mapping config, model retraining job (scheduled, with drift monitoring), key rotation (documented runbook).
- **Removal path (banks ask this):** disable grant automation → roles fall back to manual issuance → uninstall. The protected workflow never changes.

## Slide 13 — Security Considerations
- **Least privilege on ourselves:** the control plane holds only GRANT/REVOKE rights on catalogue roles — it can never read customer data; its own accounts are monitored by the same drift engine (who watches the watcher — answered).
- **Evidence integrity:** hash-chained event log, ML-DSA-signed checkpoints, dual-anchored (local + external anchor) so a compromised evidence store is detectable; we claim tamper-*evident* after ingestion, not tamper-*proof* — stated on-screen.
- **Privacy & DPDP:** pseudonymized analyst view by default; identity reveal is a separate, audited, two-person action; SQL literals/results redacted; retention tiers by data class; explicitly not a performance-monitoring tool (purpose limitation, prevents surveillance misuse).
- **Adversarial ML acknowledged (NIST AI 100-2):** baselines poison-resistant via robust training windows + peer comparison; model output alone can never trigger irreversible action (ladder caps at reversible L4).
- **Known residual risks, declared:** collusion between approver and operator (mitigated by SoD checks + high-risk export workflow, not eliminated); non-mediated paths (declared on the coverage map); prototype PQC library (production = certified provider + HSM/KMS).

## Slide 14 — Architecture Diagram
Redraw this in draw.io/Excalidraw:

```
┌────────────┐   ┌────────────┐   ┌─────────────────┐
│ ITSM       │   │ PAM broker │   │ Device/Identity │
│ (tickets)  │   │ (sessions) │   │ context         │
└─────┬──────┘   └─────┬──────┘   └────────┬────────┘
      │ read-only APIs │                   │
      ▼                ▼                   ▼
┌─────────────────────────────────────────────────┐
│        CHANGEBOUND-Q CONTROL PLANE (off-path)   │
│                                                 │
│  Correlation   Entitlement    Risk Engine (AI)  │
│  Engine        Selector       + Containment     │
│  (ticket↔user  (change class  Ladder L0–L4      │
│  ↔session↔DB   → reviewed     explainable       │
│  principal)    JIT role)      scores            │
│                                                 │
│  Evidence Pipeline → Attestation Service        │
│  (hash chain)        (ML-DSA sign, ML-KEM wrap) │
└───────┬──────────────────────┬──────────────────┘
        │ GRANT role w/ expiry │ reads pgAudit
        ▼                      │
┌──────────────────────────┐   │    ┌──────────────┐
│ PostgreSQL (target)      │───┘    │ SOC Dashboard│
│ NATIVE ENFORCEMENT:      │        │ timeline·risk│
│ pre-reviewed JIT roles,  │        │ coverage map │
│ RLS, denial of out-of-   │        │ verifier     │
│ scope ops, pgAudit       │        └──────────────┘
└──────────────────────────┘
   ▲ DBA connects via PAM (normal workflow, unchanged)
```

Caption: *"Enforcement is native and local. The control plane is off the critical path — its failure cannot block administration."*

## Slide 15 — Screenshots, Video, GitHub
Demo video storyboard (≤5 min) — the **"one hero, one villain"** script:
1. (30s) The gap: analyst manually hunting across 3 consoles — painful.
2. (60s) Happy path: Ravi's approved reconciliation maintenance — ticket → PAM → auto-selected `RECON_MAINTENANCE` role → work succeeds → role expires → attestation sealed VERIFIED.
3. (60s) Insider attempt 1: same approved session tries `SELECT * FROM customers_raw` → **PostgreSQL denies natively** (show the psql error) → drift case opens with explanation.
4. (45s) Insider attempt 2: ghost session — direct DB connection, no ticket → flagged UNAPPROVED in seconds; risk ladder escalates → step-up MFA → quarantine to read-only.
5. (30s) Tamper moment: modify one byte of the attestation → verifier flashes **INVALID**. Then show HNDL one-liner: "this archive is safe even against a future quantum adversary."
6. (30s) Ablation toggle + coverage map: "here's what the AI adds, and here's what we don't cover — labeled UNKNOWN, never assumed approved."
7. (15s) Close on the 6-outcome mapping table, all green.

## Slide 16 — Thank You
- Team members, roles, contacts.
- Closing line: *"Every privileged session, bound to its approval. Every deviation, caught in real time. Every action, provable for a decade — even against a quantum adversary."*

---

# PART D — Judge Q&A cheat sheet (the 12 that decide the outcome)

1. **"Why is this not CyberArk + Guardium + ServiceNow?"** — Those are our data sources, not our competitors. Each holds one fragment; none answers "did the action match the approval?" We are the correlation and attestation plane above them. A bank keeps all three and gains the answer none of them give.
2. **"What does the bank remove?"** — Standing privilege, manual investigation hours, and audit-prep effort — not products. Risk and labor, which is what CISOs are actually budgeted on.
3. **"What if the ticket is vague free text?"** — Pilot targets workflows with structured tickets (standard for production DB changes under change management). Vague tickets map to broader review-only monitoring, never to inferred permissions — we refuse to guess scope, by design.
4. **"Can a superuser bypass the role?"** — Yes, and we say so: superuser and table-owner paths are on the coverage map as observed-not-prevented; superuser sessions without lineage are the highest-severity alert class. We claim honest coverage, not magic.
5. **"What happens when ChangeBound-Q goes down?"** — Nothing stops. Grants already issued expire naturally in the database; break-glass is untouched; new grants fall back to the existing manual process. Fail-safe by architecture — no inline gateway.
6. **"Why won't AI false positives disrupt operations?"** — Below L5, every automated response is reversible friction (recording, MFA, TTL, read-only) — never a denial of approved work. Irreversible action requires a human. Worst case of a false positive is 30 seconds of MFA.
7. **"What exactly does PQC protect?"** — Artefacts and credentials, per the problem statement: evidence archives retained for a decade are a harvest-now-decrypt-later target; attestations must be verifiable after RSA/ECC fall. ML-KEM wraps evidence keys and session credentials; ML-DSA signs attestations. It does not improve detection and we never claim it does.
8. **"What does the AI add beyond rules?"** — We show the ablation: rules catch scope drift deterministically; the model catches *within-scope* anomalies (reconnaissance, unusual volume/time/sequence) and cuts analyst triage load by ranking. If a bank's data shows no lift, it runs rules-only — the architecture doesn't care. We measure, not assert.
9. **"Can a compromised approver still authorize misuse?"** — Collusion defeats any approval-based control, including everything the bank runs today. We narrow it: SoD checks, high-risk change classes require dual approval, exports run through a separate controlled workflow, and the attestation makes the collusion *provable afterwards* — which changes insider economics.
10. **"Operator burden?"** — Zero new fields, zero new approvals for normal work. The DBA's day is unchanged. That's the adoption thesis.
11. **"Who owns it in the bank?"** — SOC owns cases; IAM owns the entitlement catalogue; it's operable by existing teams because enforcement rides native controls — no new Tier-0 on-call.
12. **"Why should the bank fund it?"** — RBI CSF already requires privileged activity monitoring and audit trails; inspections repeatedly flag standing privilege and unmapped privileged activity. We convert a recurring inspection finding into generated, signed evidence. Compliance pull + measured investigation-time savings.

---

# PART E — Prototype build checklist (ordered for today)

Must-have for submission (in demo-impact order):
1. Docker Compose: PostgreSQL 16 + pgAudit, seeded synthetic reconciliation schema (`customers_raw`, `recon_masked_view`, one safe maintenance function).
2. Three pre-created roles: `RECON_READ_ONLY`, `RECON_MAINTENANCE`, `RECON_EXPORT_APPROVED` (SQL in repo, DBA-review comments inline).
3. Mock ITSM (JSON tickets, ServiceNow-like schema) + mock PAM session broker (issues named session + temp DB principal).
4. Correlation service (FastAPI): links ticket↔user↔session↔principal↔target↔window; grants role with expiry; revokes on expiry.
5. Drift rules: wrong target / outside window / cancelled ticket / out-of-class statement (from pgAudit) / unlinked session detection.
6. **The native-denial demo:** psql attempt on `customers_raw` under `RECON_MAINTENANCE` → permission denied (this single screenshot beats any dashboard).
7. Attestation service: canonical JSON manifest → ML-DSA-65 sign; evidence bundle → AES-256-GCM, DEK wrapped ML-KEM-768; verifier CLI/page with VERIFIED/GAP/INVALID; tamper demo.
8. Risk engine: Isolation Forest over synthetic session features + hand-written feature attributions; ladder actions L1–L4 wired to the mock broker (MFA challenge = simulated prompt; quarantine = SET ROLE read-only).
9. SOC dashboard: session timeline (approved vs observed), risk score + reasons, coverage map, attestation verifier.
10. Ablation toggle (rules / ML / both) + README + 5-min video per the Slide 15 storyboard.

If time runs out today, cut in this order (last to cut first): dashboard polish → ablation toggle → risk engine (keep a scored mock) — never cut items 1–7; native denial + PQC attestation + ghost-session detection are the demo's spine.
