# ChangeBound Q — Interactive Prototype

ChangeBound Q is a privileged-session assurance concept for banks. It binds privileged access to approved change intent, detects command and behavior drift, applies reversible risk-based controls, and produces quantum-safe evidence metadata.

This repository contains a polished React prototype built from `ChangeBound-Q_Master_Blueprint.md`. It is intentionally simulation-backed: the analyst workflow, state transitions, ablation behavior, containment ladder, case creation, fail-safe state, and attestation verdicts are interactive; PostgreSQL enforcement, live PAM/ITSM connectors, trained models, and certified PQC providers remain production integration work.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://127.0.0.1:5173`.

Quality checks:

```bash
pnpm lint
pnpm build
```

## Prototype flows

- Switch `Rules only`, `ML only`, and `Combined` to see why behavioral analysis adds value.
- Select a session and apply L1–L5 containment. L5 is explicitly human-only.
- Require step-up MFA and open an investigation case.
- Use `Run demo` for native denial, ghost-session, behavioral anomaly, and control-plane fail-safe scenarios.
- Open Attestations, verify a package, then tamper one byte to produce `INVALID` and a localized broken chain.
- Review Coverage for mediated, observed-only, and unknown trust boundaries.

## Design and analysis

- [Accepted dashboard concept](design/changebound-q-dashboard-concept.png)
- [Blueprint analysis and improved product model](docs/Blueprint-Analysis-and-Prototype-Scope.md)

## Production boundary

Do not present this UI prototype as deployed banking enforcement. A production pilot needs real ITSM/PAM connectors, a hardened policy service, target-specific enforcement adapters, append-only telemetry, independent key custody, a certified cryptographic provider, privacy controls, model governance, and staged shadow → advisory → enforce rollout.
