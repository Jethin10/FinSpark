import { CheckCircle2, ChevronRight, Clock3, Search, ShieldAlert, UserRound } from 'lucide-react'
import { StatusPill } from '../components/ui.jsx'

const severityTone = { Critical: 'danger', High: 'warning', Medium: 'info', Low: 'success' }

export function CasesPage({ cases, sessions, notify }) {
  return (
    <div className="page-stack">
      <div className="page-intro">
        <p>Cases preserve machine evidence, policy decisions, and human actions as one reviewable record.</p>
        <div className="page-tools"><label><Search /><input aria-label="Search cases" placeholder="Search case, session, identity" /></label><button type="button">Open {cases.filter((item) => item.status !== 'Contained').length}</button><button type="button">Contained {cases.filter((item) => item.status === 'Contained').length}</button></div>
      </div>
      <section className="panel cases-board">
        <div className="cases-summary">
          <div><ShieldAlert /><span><b>{cases.length}</b> active investigations</span></div>
          <div><Clock3 /><span>Median time to triage <b>4m 12s</b></span></div>
          <div><CheckCircle2 /><span>Evidence completeness <b>97.8%</b></span></div>
        </div>
        <div className="case-list">
          {cases.map((item) => {
            const session = sessions.find((entry) => entry.id === item.sessionId)
            return (
              <button key={item.id} type="button" onClick={() => notify('Case opened', `${item.id}: ${item.title}`, 'neutral')}>
                <span className="case-id">{item.id}</span>
                <span className="case-title"><strong>{item.title}</strong><small>{session ? `${session.target} · ${session.id}` : item.sessionId}</small></span>
                <StatusPill tone={severityTone[item.severity]}>{item.severity}</StatusPill>
                <span className="case-owner"><UserRound />{item.owner}</span>
                <span className="case-status">{item.status}</span>
                <time>{item.age}</time>
                <ChevronRight />
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
