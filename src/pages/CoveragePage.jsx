import { AlertTriangle, ArrowRight, CheckCircle2, Database, Eye, HelpCircle, Network, ShieldCheck } from 'lucide-react'

const groups = [
  { id: 'mediated', icon: ShieldCheck, title: 'Mediated', count: 31, copy: 'ChangeBound Q issues and revokes the principal, so native least privilege is enforceable.', examples: ['PostgreSQL reconciliation', 'Oracle payments core', 'Treasury data warehouse'] },
  { id: 'observed', icon: Eye, title: 'Observed only', count: 24, copy: 'Telemetry is correlated and scored, but another system owns enforcement.', examples: ['Legacy DB2 estates', 'SaaS administration', 'Network device consoles'] },
  { id: 'unknown', icon: HelpCircle, title: 'Unknown', count: 9, copy: 'No reliable event source or identity binding exists. This is surfaced as a gap, never assumed safe.', examples: ['OS-level access', 'Backup console', 'Offline maintenance path'] },
]

export function CoveragePage() {
  return (
    <div className="page-stack coverage-page">
      <div className="page-intro"><p>Trust comes from showing control boundaries as clearly as detections.</p></div>
      <section className="trust-flow">
        <div><span><Network /></span><strong>ITSM + PAM</strong><small>Intent and identity</small></div><ArrowRight /><div><span><ShieldCheck /></span><strong>Assurance plane</strong><small>Bind, score, respond</small></div><ArrowRight /><div><span><Database /></span><strong>Native controls</strong><small>Database enforcement</small></div><ArrowRight /><div><span><CheckCircle2 /></span><strong>Attestation</strong><small>Portable evidence</small></div>
      </section>
      <div className="coverage-columns">
        {groups.map(({ id, icon: Icon, title, count, copy, examples }) => (
          <section key={id} className={`panel coverage-group coverage-group--${id}`}>
            <header><span><Icon /></span><div><h2>{title}</h2><p>{copy}</p></div><strong>{count}</strong></header>
            <ul>{examples.map((item) => <li key={item}><i />{item}</li>)}</ul>
          </section>
        ))}
      </div>
      <section className="panel honest-limits">
        <div><AlertTriangle /><span><h2>Honest limitations are a product feature</h2><p>Superusers and table owners can bypass grants; control-plane compromise is a distinct threat; correlation can fail; and behavioral models can be wrong. Each condition produces an explicit coverage or confidence state instead of a false green status.</p></span></div>
        <ul><li><b>Identity confidence</b><span>Exact, heuristic, or unlinked—kept separate from behavior risk.</span></li><li><b>AI authority</b><span>May escalate only through L4; L5 termination is human-only.</span></li><li><b>Adoption</b><span>Shadow → advisory → enforce, with rollback at every stage.</span></li><li><b>Privacy</b><span>Statement redaction, purpose limits, retention windows, and access logging.</span></li></ul>
      </section>
    </div>
  )
}
