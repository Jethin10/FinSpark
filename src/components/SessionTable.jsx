import { Clock3, Database, Link2, ShieldCheck, ShieldQuestion, Ticket, Unlink2, UserRound } from 'lucide-react'
import { ModeSwitch, RiskGauge } from './ui.jsx'
import { riskFor } from '../data.js'

function Binding({ session }) {
  if (session.binding === 'Unlinked') return <span className="cell-status cell-status--danger"><Unlink2 />Unlinked</span>
  return <span className="cell-status cell-status--success"><Link2 />{session.binding}</span>
}

function Control({ session }) {
  const isDanger = session.control === 'Unknown' || session.status === 'terminated'
  const isWarning = session.status === 'elevated' || session.status === 'quarantined'
  const Icon = isDanger ? ShieldQuestion : isWarning ? Clock3 : ShieldCheck
  return <span className={`cell-status ${isDanger ? 'cell-status--danger' : isWarning ? 'cell-status--warning' : ''}`}><Icon />{session.control}</span>
}

export function SessionTable({ sessions, selectedId, onSelect, mode, setMode, expanded = false }) {
  return (
    <section className={`panel session-panel ${expanded ? 'session-panel--expanded' : ''}`}>
      <div className="panel-heading session-panel__heading">
        <div><h2>Live privileged sessions</h2></div>
        <div className="mode-control"><span>Mode</span><ModeSwitch value={mode} onChange={setMode} compact /></div>
      </div>
      <div className="session-tabs" role="tablist" aria-label="Session status">
        <button type="button" className="is-active">All <b>{sessions.length + 7}</b></button>
        <button type="button">Elevated <b>{sessions.filter((item) => item.status === 'elevated').length + 1}</b></button>
        <button type="button">Unlinked <b>{sessions.filter((item) => item.binding === 'Unlinked').length}</b></button>
      </div>
      <div className="table-scroll">
        <table className="session-table">
          <thead><tr><th>Identity</th><th>Change</th><th>Target</th><th>Binding</th><th>Risk</th><th>Control</th></tr></thead>
          <tbody>
            {sessions.map((session) => {
              const risk = riskFor(session, mode)
              return (
                <tr key={session.id} className={`${selectedId === session.id ? 'is-selected' : ''} session-row--${session.status}`} onClick={() => onSelect(session.id)} tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onSelect(session.id)}>
                  <td><span className="identity-cell"><UserRound /><span><strong>{session.person}</strong><small>{session.email}</small></span></span></td>
                  <td>{session.ticket ? <span className="ticket-cell"><Ticket />{session.ticket}</span> : <span className="ticket-cell ticket-cell--missing"><span />No ticket</span>}</td>
                  <td><span className="target-cell"><Database /><span><strong>{session.target}</strong><small>{session.engine}</small></span></span></td>
                  <td><Binding session={session} /></td>
                  <td><RiskGauge value={risk} size="sm" /></td>
                  <td><Control session={session} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <footer className="panel-footer"><span><i className="pulse-dot" />Auto-refresh: 5s</span><span>1–{sessions.length} of {sessions.length + 7}</span></footer>
    </section>
  )
}
