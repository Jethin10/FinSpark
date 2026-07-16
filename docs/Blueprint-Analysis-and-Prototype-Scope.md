# ChangeBound Q — Blueprint Analysis and Improved Product Model

## Executive verdict

The blueprint has a strong, differentiated center: **approved access is not the same as approved behavior**. Binding the ticket, human, PAM session, device, temporary principal, native entitlement, observed commands, control decisions, and evidence package into one chain is materially more useful than another generic insider-risk dashboard.

The strongest judge-facing proof is the combination of:

1. PostgreSQL denying an unauthorized command natively.
2. A direct “ghost” connection becoming UNKNOWN instead of being silently trusted.
3. A rules-green session becoming high risk only when behavior analysis is enabled.
4. AI triggering reversible friction, never an autonomous conviction.
5. A signed, encrypted evidence package becoming INVALID after one-byte tampering.
6. The control plane failing without taking the target database down.

That story maps cleanly to the problem statement and to the supplied evaluation weighting, where business relevance and security dominate the score.

## What the master plan already gets right

- **Approval-to-action binding** is a precise product idea, not a broad “AI for security” claim.
- **Native least privilege** makes the protection durable even when the monitoring product is unavailable.
- **Explainable behavioral analysis plus ablation** proves that the model contributes a signal the rules cannot provide.
- **Graduated containment** recognizes that insider-risk evidence is probabilistic and responses must be reversible.
- **Quantum-safe evidence has a concrete threat model**: retained audit artefacts and delivered credentials may face harvest-now-decrypt-later risk.
- **Coverage honesty** improves credibility by separating mediated, observed-only, and unknown paths.
- **The fail-safe design** avoids putting a new fragile component inline with critical banking operations.

## Corrections and improvements

### 1. Do not collapse trust into one opaque risk score

The UI should preserve four distinct dimensions:

- **Binding confidence:** exact, heuristic, or unlinked.
- **Intent drift:** command, object, target, window, or ticket-state violation.
- **Behavior anomaly:** deviation from personal and peer baselines.
- **Business impact:** sensitivity and blast radius of the target asset.

The displayed risk can summarize these dimensions, but the decision record must retain them independently. An unlinked low-volume session may still demand a stronger response than an exactly linked but unusual read-only session.

### 2. Make response confidence-aware

Use a policy matrix instead of score thresholds alone:

- Exact binding + mild anomaly → enhanced logging or MFA.
- Exact binding + native denial → case creation and step-up.
- Heuristic binding + high-impact asset → shorten TTL and analyst review.
- Unlinked privileged principal → critical case and human termination path.

Automated actions stop at L4. L5 termination/disable remains human-only and should record analyst identity, reason, and optional dual authorization for critical systems.

### 3. Treat correlation failure as a security state

Ticket/session/device joins can fail because of clock drift, connector delay, shared accounts, NAT, or partial telemetry. The product should expose confidence and reason codes rather than forcing a binary linked/unlinked label. Time synchronization, connector freshness, and event-lag health belong in every decision.

### 4. Expand the identity model

The problem statement includes employees, contractors, vendors, admins, and compromised identities. The production model should also cover:

- Service and workload identities.
- Vendor access with sponsor and contract expiry.
- Break-glass sessions with retrospective review.
- Shared-account elimination or explicit attribution gaps.
- Privilege inherited through groups, nested roles, and cloud control planes.

### 5. Harden telemetry and the control plane

The blueprint is strong against target-system failure but needs an explicit control-plane threat model:

- Append-only remote log export and signed ingestion checkpoints.
- Separate service identities for correlation, enforcement, and evidence sealing.
- Minimal database DDL authority scoped to temporary principals only.
- Control-plane admin actions sent into the same evidence chain.
- Clock integrity, replay protection, connector health, and gap verdicts.

### 6. Add model governance, not just model accuracy

Isolation Forest is appropriate for a fast prototype, but production requires:

- Cold-start behavior and minimum-history thresholds.
- Model versioning and per-decision feature snapshots.
- Drift monitoring, false-positive review, analyst feedback, and rollback.
- Poisoning resistance and separation between training and evaluation data.
- Persona-aware baselines for humans, services, vendors, and emergency accounts.
- A deterministic fallback whenever model health is degraded.

### 7. Operationalize privacy

Privileged telemetry can contain customer data, credentials, and sensitive SQL. Apply statement parameter suppression, tokenization/redaction, purpose-based access, retention windows, investigation access logging, legal holds, and region-aware storage. Analysts usually need command class, object, outcome, and risk reason—not full query parameters.

### 8. Make PQC crypto-agile and independently verifiable

The blueprint correctly uses ML-DSA for signatures and ML-KEM for key establishment. Production should add:

- A versioned crypto envelope and algorithm registry.
- Hybrid classical + PQC migration where required by policy.
- HSM/KMS-backed key custody, rotation, revocation, and recovery.
- Separate signer and evidence-custodian roles.
- Verification tooling that works without the ChangeBound Q control plane.
- Clear provider claims: prototype library today, certified provider in production.

PQC protects long-lived evidence and credential channels; it does not improve detection quality, and the product should never imply that it does.

### 9. Define measurable pilot acceptance

Track outcomes that a bank can validate:

- Percentage of privileged sessions bound exactly to an approved change.
- Ghost-session detection latency.
- Native denial and containment latency.
- False-positive rate by identity persona and target.
- Analyst time to triage and time to revoke.
- Percentage of evidence packages independently verified.
- Telemetry gap rate and connector freshness.
- Standing privilege removed and privileged-session coverage gained.

### 10. Preserve a staged adoption path

Adopt in three removable phases:

1. **Shadow:** observe, bind, score, and prove coverage without changing access.
2. **Advisory:** recommend MFA, TTL reduction, quarantine, and case actions.
3. **Enforce:** issue approved JIT roles and apply selected reversible responses.

This lowers rollout risk and produces bank-specific evidence before automation authority increases.

## Improved product model

The central object should be a **Privileged Change Graph**:

`person/workload → device → PAM session → ticket version → JIT principal → approved entitlement → target asset → commands → decisions → containment actions → attestation`

Every node has provenance and confidence. Every edge can be exact, heuristic, missing, stale, or contradictory. Rules evaluate intent drift; the behavior engine evaluates anomaly; the policy engine combines those signals with asset impact and response constraints; the evidence service seals the complete decision history.

This graph improves the original plan because it supports partial evidence without turning uncertainty into false approval.

## Prototype implemented in this repository

The prototype demonstrates the complete analyst experience:

- Security overview with operational metrics and live privileged sessions.
- Rules-only, ML-only, and combined ablation modes.
- Exact, heuristic, and unlinked binding states.
- Explainable top behavioral deviations.
- Reversible containment ladder with human-only L5.
- Step-up MFA, TTL, quarantine, termination, and case state changes.
- Native-denial, ghost-session, anomaly, and fail-safe rehearsal flows.
- Approval → action → evidence timeline.
- Mediated, observed-only, and unknown coverage map.
- Attestation verification, GAP, and one-byte tamper → INVALID states.
- Responsive desktop and mobile layouts.

## Explicit prototype limits

This is a high-fidelity interactive prototype, not a deployed control plane. The current data and decision transitions are simulated in React. The repository does not yet contain live PostgreSQL/pgAudit enforcement, ITSM or PAM connectors, a trained Isolation Forest service, durable case storage, ML-KEM/ML-DSA cryptographic execution, HSM custody, or Docker deployment.

Those are the next engineering layer. Keeping that boundary explicit protects the credibility of the demo and prevents UI behavior from being presented as production security evidence.
