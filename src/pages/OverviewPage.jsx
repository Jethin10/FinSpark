import { Activity, AlertTriangle, Check, CheckCircle2, CircleDotDashed, Clock3, DatabaseZap, FileCheck2, KeyRound, Link2, LockKeyhole, ShieldCheck, UsersRound } from 'lucide-react'
import { SessionTable } from '../components/SessionTable.jsx'
import { SessionInspector } from '../components/SessionInspector.jsx'

const metrics = [
  { label: 'Active privileged sessions', value: '12', note: 'Live now', icon: UsersRound, tone: 'blue' },
  { label: 'High risk', value: '2', note: '> 70 risk score', icon: AlertTriangle, tone: 'amber' },
  { label: 'Native denials', value: '7', note: 'Last 24h', icon: DatabaseZap, tone: 'blue' },
  { label: 'Attestations verified', value: '98.6%', note: 'Last 24h', icon: CheckCircle2, tone: 'green' },
]

function MetricsRail() {
  return (
    <section className="metrics-rail" aria-label="Security metrics">
      {metrics.map(({ label, value, note, icon: Icon, tone }) => (
        <article key={label} className={`metric metric--${tone}`}>
          <span className="metric__icon"><Icon /></span>
          <div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>
        </article>
      ))}
    </section>
  )
}

function EvidenceTimeline({ items }) {
  const icons = { done: Check, progress: Activity, alert: AlertTriangle, pending: CircleDotDashed }
  return (
    <section className="panel evidence-timeline">
      <div className="panel-heading"><div><h2>Approval → Action → Evidence</h2></div></div>
      <div className="timeline-track">
        {items.map((item, index) => {
          const Icon = icons[item.state]
          return (
            <div key={item.label} className={`timeline-item timeline-item--${item.state}`}>
              <div className="timeline-icon"><Icon /></div>
              {index < items.length - 1 ? <span className="timeline-line" /> : null}
              <strong>{item.label}</strong><small>{item.detail}</small><time>{item.time}</time>
            </div>
          )
        })}
      </div>
      <div className="timeline-legend"><span className="done">Completed</span><span className="progress">In progress</span><span className="pending">Pending</span><span className="alert">Alert</span></div>
    </section>
  )
}

function CoverageMini() {
  return (
    <section className="panel coverage-mini">
      <div className="panel-heading"><div><h2>Coverage map</h2></div></div>
      <div className="coverage-mini__body">
        <div className="coverage-donut"><span><strong>64</strong><small>Targets</small></span></div>
        <ul className="coverage-legend">
          <li><i className="mediated" /><span>Mediated</span><b>31 <small>(48%)</small></b></li>
          <li><i className="observed" /><span>Observed only</span><b>24 <small>(37%)</small></b></li>
          <li><i className="unknown" /><span>Unknown</span><b>9 <small>(14%)</small></b></li>
        </ul>
        <div className="limitations"><strong>Candid limitations</strong><ul><li>Legacy DB2 not natively mediated</li><li>Some SaaS consoles observed via proxy</li><li>File-system access stays out of scope</li></ul></div>
      </div>
    </section>
  )
}

function QuantumEvidenceStrip({ controlPlaneOnline }) {
  return (
    <section className="quantum-strip">
      <div><ShieldCheck /><strong>Quantum-safe evidence</strong></div>
      <span><FileCheck2 />ML-DSA-65 <small>signed</small></span>
      <span><Link2 />ML-KEM-768 <small>wrapped</small></span>
      <span><LockKeyhole />AES-256-GCM <small>encrypted</small></span>
      <span className={controlPlaneOnline ? 'pending' : 'delayed'}><Clock3 /><small>Verification status</small>{controlPlaneOnline ? 'Pending for this session' : 'Delayed · back-fill queued'}</span>
      <button type="button">View evidence chain</button>
    </section>
  )
}

export function OverviewPage({ mode, setMode, sessions, selectedSession, setSelectedId, cases, applyContainment, requireMfa, openCase, timeline, controlPlaneOnline }) {
  return (
    <div className="overview-page">
      <MetricsRail />
      {!controlPlaneOnline ? <div className="failsafe-banner"><DatabaseZap /><div><strong>Control plane offline. Native enforcement remains active.</strong><span>Audit logs are accumulating for replay; currently granted database access is unaffected.</span></div></div> : null}
      <div className="overview-grid">
        <SessionTable sessions={sessions.slice(0, 3)} selectedId={selectedSession.id} onSelect={setSelectedId} mode={mode} setMode={setMode} />
        <SessionInspector session={selectedSession} mode={mode} applyContainment={applyContainment} requireMfa={requireMfa} openCase={openCase} hasCase={cases.some((item) => item.sessionId === selectedSession.id)} />
        <EvidenceTimeline items={timeline} />
        <CoverageMini />
      </div>
      <QuantumEvidenceStrip controlPlaneOnline={controlPlaneOnline} />
    </div>
  )
}
