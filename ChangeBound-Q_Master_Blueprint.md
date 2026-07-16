# ChangeBound-Q — Master Blueprint (Single Source of Truth)

**FinSpark'26 · Problem Statement 1 · Privileged Access Misuse & Insider Threat Detection**

Companion file: `ChangeBound-Q_Winning_Submission.md` (slide content, judge Q&A, pitch language).
This file: the complete technical plan — flows, stack, schemas, SQL, ML, PQC, repo, demo runbook, timeline, team roles.

---

## 0. The concept, locked (do not re-litigate)

> **ChangeBound-Q is a quantum-safe privileged-session assurance plane. It binds every privileged database session to its approved change ticket, issues the narrowest pre-reviewed just-in-time entitlement (enforced natively by PostgreSQL), detects approval-to-action drift and behavioural anomalies in real time, responds through a graduated reversible containment ladder, and seals every session into an ML-DSA-signed, ML-KEM-protected Change Execution Attestation.**

Six pillars — each maps to one PS1 expected outcome and one demo moment:

| # | Pillar | PS1 outcome | Demo moment |
|---|--------|-------------|-------------|
| 1 | Approval↔Action binding (correlation engine) | Detects misuse of privileged accounts | Ticket→session→role linkage appears live |
| 2 | Real-time drift + ghost-session detection | Identifies insider threats in real time | Unlinked psql connection flagged in <5 s |
| 3 | Behavioural risk engine (explainable) | AI-driven behavioural analysis | Risk score with plain-English reasons |
| 4 | Graduated Containment Ladder | Risk-based access control | Live step-up MFA + quarantine to read-only |
| 5 | Zero standing privilege, native JIT enforcement | Protects critical administrative systems | PostgreSQL itself denies the raw export |
| 6 | Quantum-safe attestation | QPC for artefacts & credentials | Tamper one byte → INVALID |

---

## 1. Complete end-to-end flows

### Flow A — Happy path (approved maintenance)

```
 ACTOR: Ravi (DBA) · TICKET: CHG-2041 "Reindex recon tables" · CLASS: RECON_MAINTENANCE
```

1. **Ticket exists** in mock ITSM: `CHG-2041`, status=APPROVED, change_class=`RECON_MAINTENANCE`, target=`recon_db`, window=22:00–23:00, requester=ravi, approver=priya (SoD check: requester ≠ approver — enforced at import).
2. **Ravi checks out a session** from the mock PAM broker, citing CHG-2041. Broker verifies: ticket APPROVED, Ravi is the requester, current time inside window, device fingerprint known.
3. **Correlation engine builds the binding**: `{person: ravi, ticket: CHG-2041 (content-hash h1), pam_session: PS-7781, device: LT-4432}` → this is the session's identity for everything downstream.
4. **Entitlement selector** maps change_class → catalogue role `recon_maintenance` (pre-reviewed SQL, versioned in git). No LLM, no inference — a lookup into a DBA-approved table.
5. **JIT principal issued**: `CREATE ROLE tmp_ps7781 LOGIN PASSWORD '<random>' VALID UNTIL '<window_end>'; GRANT recon_maintenance TO tmp_ps7781;` Credential is delivered to the broker wrapped under an **ML-KEM-768**-established key (the "QPC secures credentials" demo point). A revocation job is scheduled for window_end.
6. **Ravi connects** through the broker with `tmp_ps7781`. His tools work normally — he typed nothing new, approved nothing extra.
7. **pgAudit streams every statement** (CSV log → tailer → event pipeline). Each event is stamped with `session_authorization` = `tmp_ps7781` → joins back to the binding.
8. **Drift engine checks each event** against the binding: right database? inside window? statement class allowed for RECON_MAINTENANCE? ticket still APPROVED? All green.
9. **Risk engine scores the session** continuously (features §5). Ravi at 22:10 from his usual laptop doing his usual reindex → score 0.08 → L0, nothing happens.
10. **Window ends**: membership revoked (`REVOKE recon_maintenance FROM tmp_ps7781`), role dropped, open backends terminated. Standing privilege on this workflow: **zero**.
11. **Attestation sealed**: manifest binds ticket-hash, actor, PAM session, DB principal, role+version, grant/revoke times, pgAudit event IDs + hashes, decisions, coverage statement → **ML-DSA-65 signature**; evidence bundle AES-256-GCM encrypted, DEK wrapped via **ML-KEM-768**.
12. **Dashboard** shows the session tile: LINKED · IN-SCOPE · VERIFIED.

### Flow B — In-scope session goes out of scope (the money demo)

1–7 same as Flow A. Then:
8. Ravi (or an attacker on his session) runs `SELECT * FROM customers_raw;`
9. **PostgreSQL denies it natively** — `permission denied for table customers_raw` — because `recon_maintenance` simply has no grant on it. ChangeBound-Q did not have to be alive for this to happen. *(Say that sentence to judges.)*
10. The denial appears in the Postgres log → drift engine correlates it to CHG-2041 → rule R6 fires → **case opened at L1** with the ticket, actor, exact statement, and the native denial as evidence.
11. Risk engine adds the attempt to the session's features (first-ever reference to `customers_raw`) → score jumps → **L2: step-up MFA challenge** issued through the broker before the session may continue.
12. Attestation for this session records the attempt + denial → auditor sees approved work AND the deviation, signed.

### Flow C — Ghost session (unlinked direct connection)

1. Attacker (or lazy admin) connects **directly** to `recon_db` port with a standing account `dba_legacy`, bypassing the broker.
2. pgAudit event arrives with a principal the broker never issued → rule **R1: UNLINKED SESSION** fires in seconds.
3. Dashboard flags it **UNAPPROVED / UNKNOWN** — never "assumed approved." Case opens at L3 severity with source IP, principal, and statements.
4. Ladder response: analyst sees one-click actions — terminate backends (`pg_terminate_backend`), disable the principal (`ALTER ROLE dba_legacy NOLOGIN`) — human-triggered (L5 is always a human).
5. Coverage map notes: prevention on this path = native only; detection = seconds. Honest and demonstrable.

### Flow D — Behavioural anomaly within scope (AI earns its keep)

1. Session is fully linked and in-scope (rules see nothing), but: 02:40 instead of usual 22:00, new device fingerprint, touching 4× the usual table count, running schema-wide metadata enumeration (recon pattern).
2. Rules: all green. **Risk engine: score 0.87.** Reasons rendered: "time-of-day 3.1σ from personal baseline · device never seen · table breadth 4× peer median · catalog enumeration sequence."
3. Ladder: L2 step-up MFA → passes → L3 TTL shortened to 15 min + optional scopes withdrawn → analyst case with full context.
4. This is the ablation argument: **rules cannot see this session; the model can.** Toggle ML off on the dashboard → session shows green. Toggle on → 0.87. That 10-second toggle is your "AI adds value" proof.

### Flow E — Attestation verify & tamper

1. Analyst exports `CHG-2041.attestation.json`.
2. Verifier (CLI + dashboard page): recompute manifest hash → verify ML-DSA-65 → decapsulate ML-KEM → unwrap DEK → decrypt bundle → recompute per-event hash chain → **VERIFIED** (green, with algorithm labels shown: FIPS 203/204).
3. Flip one byte in the bundle (`sed` one char) → re-verify → **INVALID**, and the verifier names the first broken link in the chain.
4. If events are missing between checkpoints → **GAP**, not silently VERIFIED. Three verdicts, honestly separated.

### Flow F — Kill ChangeBound-Q (fail-safe demo, 30 seconds, judges remember it)

1. `docker compose stop control-plane` **mid-session**.
2. Ravi's granted role keeps working. His session continues. Nothing breaks.
3. Expiry still happens — `VALID UNTIL` lives in PostgreSQL, not in our process.
4. Restart control plane → it back-fills events from the pgAudit log (append-only, nothing lost) and seals the attestation late, flagged `ingestion_delayed=true`.
5. Line to judges: *"Our total failure is a monitoring gap, never an operations outage. Inline competitors cannot say that."*

---

## 2. Architecture & exact tech stack

```
┌───────────────────────── docker compose ─────────────────────────┐
│                                                                  │
│  mock-itsm        mock-pam          control-plane (FastAPI)      │
│  (FastAPI router) (FastAPI router)  ├─ correlation engine        │
│         │               │           ├─ entitlement selector      │
│         └──────┬────────┘           ├─ JIT grant/revoke worker   │
│                ▼                    ├─ drift rules engine        │
│         REST (read-only ────────►   ├─ risk engine (sklearn)     │
│         in shadow mode)             ├─ containment ladder        │
│                                     ├─ evidence pipeline         │
│                                     └─ attestation svc (PQC)     │
│                                          │            ▲          │
│   postgres:16 + pgAudit                  │ GRANT/     │ verify   │
│   ├─ recon_db (synthetic data)      ◄────┘ REVOKE     │          │
│   ├─ catalogue roles (3)                              │          │
│   └─ csvlog ──► log-tailer ──► event pipeline    dashboard       │
│                                                  (React or HTMX) │
│   cbq_meta (Postgres schema): bindings, events,                  │
│   cases, attestations, model features                            │
└──────────────────────────────────────────────────────────────────┘
```

| Component | Technology | Why |
|---|---|---|
| Target DB + native enforcement | **PostgreSQL 16 + pgAudit** | Real roles, real denials, real audit — no mocked security |
| Control plane | **Python 3.12 + FastAPI** (one app, modular routers) | One process = less integration risk under deadline |
| Metadata store | Same Postgres instance, separate `cbq_meta` database | No extra infra |
| Log ingestion | Postgres `csvlog` + Python tailer (watchdog) | Simple, reliable, replayable (enables Flow F back-fill) |
| Rules engine | Plain Python functions, table-driven | Auditable, explainable, fast |
| Risk engine | **scikit-learn IsolationForest** + hand-rolled feature attribution | Trains in seconds on synthetic data; explainable |
| Ladder actions | Broker flags (MFA), `ALTER ROLE ... VALID UNTIL` (TTL), role-swap (quarantine) | All real, all reversible |
| PQC | **oqs-python (liboqs)**: ML-KEM-768, ML-DSA-65; `cryptography` for AES-256-GCM + HKDF | FIPS 203/204 algorithms, real crypto in demo |
| PQC fallback if liboqs build fights you | `kyber-py` + `dilithium-py` (pure Python) | Same algorithms, zero build pain; label clearly |
| Dashboard | **React + Vite** if a teammate knows React well; otherwise **FastAPI + Jinja2 + HTMX** | HTMX cuts your risk massively; judges score the story, not the framework |
| Packaging | Docker Compose, everything pre-built | Finale demo must survive no-internet |
| Demo terminal | Plain `psql` in a visible terminal pane | Native denial must look native |

**Rule: run everything in Docker (Linux containers) — do not fight liboqs on Windows host.**

---

## 3. Data schemas (copy these)

### Ticket (mock ITSM)
```json
{
  "ticket_id": "CHG-2041",
  "version_hash": "sha256:…",
  "title": "Monthly reindex of reconciliation tables",
  "change_class": "RECON_MAINTENANCE",
  "target_system": "recon_db",
  "window_start": "2026-07-16T22:00:00+05:30",
  "window_end":   "2026-07-16T23:00:00+05:30",
  "requester": "ravi.k",
  "approver": "priya.m",
  "status": "APPROVED",
  "sod_check": {"requester_ne_approver": true}
}
```

### Session binding (the core object)
```json
{
  "binding_id": "BND-00017",
  "ticket_id": "CHG-2041", "ticket_hash": "sha256:…",
  "person": "ravi.k",
  "pam_session": "PS-7781",
  "device_fp": "LT-4432", "source_ip": "10.4.2.17",
  "db_principal": "tmp_ps7781",
  "entitlement": {"role": "recon_maintenance", "catalogue_version": "v3"},
  "granted_at": "…", "expires_at": "…",
  "link_confidence": "EXACT",          // EXACT | HEURISTIC | UNLINKED
  "status": "ACTIVE"                    // ACTIVE | EXPIRED | QUARANTINED | REVOKED
}
```

### Audit event (normalized from pgAudit CSV)
```json
{
  "event_id": "EVT-000913", "prev_hash": "sha256:…", "hash": "sha256:…",
  "ts": "…", "db_principal": "tmp_ps7781", "database": "recon_db",
  "class": "WRITE",                     // pgAudit class: READ/WRITE/DDL/ROLE/MISC
  "command": "REINDEX", "object": "recon.txn_2026q2",
  "statement_redacted": "REINDEX TABLE recon.txn_2026q2",
  "outcome": "OK",                      // OK | DENIED (from postgres error log join)
  "binding_id": "BND-00017"             // null ⇒ ghost session
}
```

### Change Execution Attestation (manifest)
```json
{
  "attestation_id": "ATT-CHG-2041-PS7781",
  "schema_version": "1.0",
  "binding": { "…": "full binding object" },
  "ticket_hash": "sha256:…",
  "entitlement": {"role": "recon_maintenance", "role_sql_hash": "sha256:…", "catalogue_version": "v3"},
  "events": {"count": 214, "first": "EVT-000701", "last": "EVT-000914",
             "chain_head": "sha256:…", "chain_tail": "sha256:…"},
  "decisions": [{"rule": "R5", "result": "PASS"}, {"rule": "R6", "result": "DENIAL_OBSERVED", "event": "EVT-000913"}],
  "risk": {"max_score": 0.31, "max_level": "L1", "model_version": "if-2026-07-16"},
  "coverage": {"mediated": ["broker->recon_db"], "observed_only": ["superuser","table-owner"], "unknown": ["os-level","backup-console"]},
  "crypto": {"sig_alg": "ML-DSA-65 (FIPS 204)", "kem_alg": "ML-KEM-768 (FIPS 203)",
             "aead": "AES-256-GCM", "provider": "liboqs (prototype-grade)", "signer_key_id": "cbq-signer-01"},
  "ingestion_delayed": false
}
```
Attestation file = `{manifest, manifest_sig, kem_ciphertext, wrapped_dek, bundle_ref}`.

---

## 4. Entitlement catalogue (actual SQL — put in `db/catalogue/` with review comments)

```sql
-- v3 · reviewed by <DBA-name> · change-classes: RECON_*
CREATE ROLE recon_read_only NOLOGIN;
GRANT CONNECT ON DATABASE recon_db TO recon_read_only;
GRANT USAGE ON SCHEMA recon TO recon_read_only;
GRANT SELECT ON recon.recon_masked_view TO recon_read_only;      -- masked view only
-- deliberately NO grant on recon.customers_raw

CREATE ROLE recon_maintenance NOLOGIN;
GRANT recon_read_only TO recon_maintenance;
GRANT EXECUTE ON FUNCTION recon.run_monthly_maintenance() TO recon_maintenance;  -- SECURITY DEFINER, DBA-reviewed body
GRANT MAINTAIN ON ALL TABLES IN SCHEMA recon TO recon_maintenance;               -- PG16: REINDEX/VACUUM etc. without ownership

CREATE ROLE recon_export_approved NOLOGIN;
GRANT recon_read_only TO recon_export_approved;
GRANT EXECUTE ON FUNCTION recon.controlled_export(date, date) TO recon_export_approved;
-- controlled_export: SECURITY DEFINER, writes ONLY to recon.export_staging,
-- enforces row cap + date-range cap inside the function, logs volume.
```

JIT issuance / revocation (control plane executes; the ONLY DDL rights our service account has):

```sql
-- grant
CREATE ROLE tmp_ps7781 LOGIN PASSWORD :pw VALID UNTIL :window_end;
GRANT recon_maintenance TO tmp_ps7781;
-- revoke (scheduled at window_end + on-demand)
REVOKE recon_maintenance FROM tmp_ps7781;
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename='tmp_ps7781';
DROP ROLE tmp_ps7781;
-- quarantine (ladder L4): swap membership, keep session observable
REVOKE recon_maintenance FROM tmp_ps7781;  GRANT recon_read_only TO tmp_ps7781;
```

Honesty notes you will say before judges ask: superusers/table owners bypass grants (coverage map: observed-not-prevented); membership changes apply to subsequent statements; `VALID UNTIL` governs login, expiry of live sessions is our revocation job + backend termination.

pgAudit config (in `postgresql.conf` / compose env): `pgaudit.log='read,write,ddl,role'`, `pgaudit.log_parameter=off` (redaction by default), `log_destination='csvlog'`, `log_connections=on`.

---

## 5. Drift rules & risk engine (exact spec)

### Deterministic rules (table-driven, each returns PASS/FIRE + evidence)

| ID | Rule | Signal source | Ladder floor |
|----|------|--------------|--------------|
| R1 | Unlinked principal (ghost session) | event.binding_id is null | L3 + analyst case |
| R2 | Event outside approved window | event.ts vs binding window | L2 |
| R3 | Wrong target database | event.database ≠ ticket.target | L3 |
| R4 | Ticket cancelled/expired mid-session | ITSM poll / webhook | L3 + revoke recommendation |
| R5 | Statement class outside change class | pgAudit class vs class-allowlist (e.g. RECON_MAINTENANCE allows READ, MAINTAIN-DDL; never ROLE) | L2 |
| R6 | Native denial observed | postgres error log join (`permission denied`) | L1 case (enforcement already happened) |
| R7 | SoD violation at import | requester == approver | block grant issuance |

### Risk engine
- **Model:** IsolationForest (n_estimators=200) per target-system, trained on ~800 synthetic historical sessions generated by `scripts/gen_history.py` (personas: 6 DBAs with distinct hour/device/volume habits + 2 service accounts).
- **Features (per session, rolling):** hour-of-day (sin, cos) · dow · device novelty (0/1) · IP-subnet novelty · statements-per-min · distinct tables touched · % READ vs baseline · first-ever-object count · catalog-enumeration flag (`pg_catalog` breadth) · denial count · session duration · peer z-score of volume.
- **Explainability:** for each feature compute personal-baseline percentile; render top-3 deviations as sentences. No SHAP needed — percentile prose is more legible to judges anyway.
- **Authority limits (hard-coded):** score maps to ladder **L1–L4 only**; L5 (revoke/terminate/disable) requires a human click. Log every model decision with model_version into the attestation.
- **Ablation toggle:** dashboard switch renders every session tile under (a) rules-only, (b) ML-only, (c) combined. Flow D is invisible under (a) — that's the proof.

### Containment ladder wiring (all real in the prototype)
- L1: enhanced logging flag + case creation.
- L2: broker sets `mfa_required=true`; demo terminal wrapper blocks next statement until TOTP entered (pyotp).
- L3: `ALTER ROLE tmp_x VALID UNTIL now()+interval '15 min'` + reschedule revocation + withdraw optional grants.
- L4: quarantine role-swap (SQL above).
- L5: buttons for terminate/disable — **human only**.

---

## 6. PQC design (exact, demo-provable)

**Keys (generated at first boot, stored in `keys/` volume):**
- `cbq-signer-01`: ML-DSA-65 keypair — attestation signing.
- `cbq-custodian-01`: ML-KEM-768 keypair — evidence-key custody (private key conceptually the auditor's/HSM's; in demo, a separate container).

**Seal (per session):**
1. Canonicalize manifest (sorted-keys JSON, UTF-8) → `m_hash = SHA-256`.
2. `sig = ML-DSA-65.sign(m_hash)`.
3. Evidence bundle (JSONL of events) → random 256-bit DEK → AES-256-GCM.
4. `(ct, ss) = ML-KEM-768.encaps(custodian_pub)`; `KEK = HKDF-SHA256(ss)`; `wrapped_dek = AES-GCM(KEK, DEK)`.
5. Persist attestation file; also sign a **rolling checkpoint** every N events (tamper localization for Flow E).

**Credential channel:** JIT password from control plane → broker travels under a fresh ML-KEM-established key (same primitive, second use — this is the "credentials" half of the PS1 QPC bullet).

**Verify:** signature → decapsulate → unwrap → decrypt → recompute hash chain → `VERIFIED | GAP | INVALID`. CLI: `python -m cbq.verify ATT-CHG-2041.json`.

**Say before asked:** liboqs is prototype-grade per its own maintainers; production = certified provider + HSM/KMS + key lifecycle; PQC protects artefacts/credentials against harvest-now-decrypt-later on decade-long RBI retention — it does not improve detection and we never claim it does.

---

## 7. Repository structure

```
changebound-q/
├─ README.md                  # 5-min quickstart + demo script + honest-claims section
├─ docker-compose.yml         # postgres, control-plane, dashboard, custodian, demo-terminal
├─ db/
│  ├─ init/ 01_schema.sql  02_synthetic_data.sql  03_catalogue_roles.sql  04_pgaudit.conf
│  └─ catalogue/              # versioned, review-commented role SQL (v1..v3)
├─ control_plane/
│  ├─ app.py                  # FastAPI: routers below
│  ├─ routers/ itsm.py  pam.py  correlate.py  entitlements.py  drift.py  risk.py  ladder.py  attest.py
│  ├─ ingest/ tailer.py  normalize.py  hashchain.py
│  ├─ crypto/ pqc.py  seal.py  verify.py
│  └─ ml/ features.py  train.py  explain.py
├─ dashboard/                 # React (or templates/ if HTMX)
├─ scripts/
│  ├─ gen_history.py          # synthetic sessions for training
│  ├─ demo_flow_a.sh … demo_flow_f.sh   # ONE COMMAND PER DEMO FLOW — rehearsal gold
│  └─ tamper.sh               # flips one byte in an attestation bundle
├─ docs/ architecture.png  threat_model.md  coverage_map.md  ablation.md  privacy_dpdp.md
└─ tests/ test_rules.py  test_seal_verify.py  test_jit_lifecycle.py
```

The `demo_flow_*.sh` scripts are non-negotiable: every demo moment reproducible with one command means zero live-typing risk at the finale.

---

## 8. Demo runbook (finale, ~7 minutes, click-by-click)

Screen layout: left = SOC dashboard, right = terminal (psql + compose commands). Rehearse until 6:30.

| t | Moment | Action | Line to say |
|---|--------|--------|-------------|
| 0:00 | Hook | Slide with PNB story + "Approval-to-Action Gap" | "India's biggest bank frauds weren't hacking. They were approved people doing unapproved things — and nothing noticed." |
| 0:45 | Happy path | `demo_flow_a.sh` → binding appears, role granted, reindex succeeds | "The DBA typed nothing new. Zero added approvals. Least privilege just happened." |
| 2:00 | **Native denial** | In psql: `SELECT * FROM customers_raw;` → permission denied | "That's PostgreSQL saying no — not our UI. Our product could be dead and this still holds." |
| 2:45 | Ghost session | Direct psql as `dba_legacy` → UNAPPROVED tile in seconds | "Unlinked never means approved. It means UNKNOWN, loudly." |
| 3:30 | AI + ladder | `demo_flow_d.sh` → score 0.87, reasons, live MFA challenge, TTL shrink | "Rules were green. The model wasn't. And AI never convicts — it escalates, reversibly." |
| 4:30 | Ablation | Toggle rules-only → tile goes green | "Ten seconds of proof that the AI earns its place." |
| 5:00 | Attestation + tamper | Verify → VERIFIED (FIPS 203/204 labels) → `tamper.sh` → INVALID | "Signed with ML-DSA, keys wrapped with ML-KEM — because evidence retained ten years is a harvest-now-decrypt-later target." |
| 6:00 | **Kill the product** | `docker compose stop control-plane` mid-session; session keeps working | "Our total failure is a monitoring gap — never a banking outage. No inline competitor can say that." |
| 6:30 | Close | 6-outcome mapping table, all green + coverage map | "And here is what we don't cover — labeled. Trust the tool that tells you what it can't see." |

Contingencies: pre-recorded video of every flow (play if live fails) · all images pre-pulled/exported (`docker save`) for no-internet · second laptop with identical setup · printed one-pager of architecture + outcome table handed to judges.

---

## 9. Presentation & team plan (up to 4 members)

| Role | Owns | During Q&A |
|---|---|---|
| Pitch lead | Hook, story, close (slides 1–2, 8–9, 16) | Business/regulatory questions (RBI CSF, DPDP, CERT-In, market) |
| Demo driver | Runbook §8, all scripts, contingency video | "Show me again" requests |
| Architect | Slides 11–14, flows, fail-safe story | Deep technical: superuser bypass, pgAudit, JIT lifecycle, scale |
| AI/PQC owner | Risk engine, ablation, attestation | Adversarial-ML, PQC threat-model, "what does AI add" |

Q&A discipline: answer in ≤3 sentences, lead with the direct answer, volunteer the honest limitation before they find it (superusers, collusion, liboqs). The full 12-answer sheet is in `ChangeBound-Q_Winning_Submission.md` Part D — memorize it as a team.

Rehearsal rule: 3 full timed run-throughs minimum, one deliberately with the control plane crashed to prove you can recover live.

---

## 10. Timeline to the trophy

| Date | Milestone |
|---|---|
| **16 Jul (today)** | Submit: deck (from submission pack) + repo with spine working + ≤5-min video. Spine = Flows A, B, C, E (native denial, ghost session, seal/verify/tamper). If hours are short, risk engine may be a scored mock TODAY — but the video must show real native denial and real PQC verify. |
| 17 Jul | Fix video/readme rough edges while Evaluation Round 2 runs. |
| 18–20 Jul | Real risk engine + ladder wiring (Flows D, F live), ablation toggle, dashboard polish. |
| 21–22 Jul | Docs: threat_model.md, coverage_map.md, ablation.md, privacy_dpdp.md. Verify all regulatory citations (RBI CSF Annex 1, IT Governance Directions 2023, CERT-In 6-hr, DPDP; PNB figure). Practitioner validation: get one DBA/SOC professional (college alumni network works) to confirm the investigation-pain story — "a bank DBA reviewed our entitlement catalogue" is a devastating line in Q&A. |
| 23–24 Jul | Freeze code. Record final backup video. 3 timed rehearsals + hostile Q&A drill (one teammate plays the CISO judge using Part D questions). Export docker images to a USB stick. |
| 25–26 Jul | Finale at COEP. Arrive with: both laptops tested, offline images, printed one-pagers, calm. |

---

## 11. Scoring self-check (audit yourself against this before submitting)

- [ ] Every one of PS1's six expected outcomes has a named feature AND a demo moment.
- [ ] The database denies something for real on camera (no UI theater).
- [ ] A ghost session is detected in seconds on camera.
- [ ] AI shows explainable value the rules miss (ablation), and its authority limit is stated.
- [ ] Risk-based access control is demonstrated live (MFA step-up + quarantine), reversibly.
- [ ] PQC has a concrete threat model (HNDL on retained evidence/credentials) + tamper→INVALID moment.
- [ ] Fail-safe demo: product dies, bank keeps working.
- [ ] Coverage map on screen: mediated / observed / UNKNOWN — honesty as a feature.
- [ ] Zero new operator burden stated and shown.
- [ ] Adoption plan: shadow → advisory → enforce; removable at any phase.
- [ ] Every claim either demonstrated or explicitly labeled as pilot-hypothesis. No claim a hostile judge can puncture.

The kill criteria and hostile analysis from your original review stay alive in `docs/threat_model.md` — judges who probe will find you already wrote their attack, and that is how this wins.
