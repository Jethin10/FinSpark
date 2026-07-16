import { AlertTriangle, Clock3, Database, FilePlus2, KeyRound, Link2, LockKeyhole, RotateCw, Shield, ShieldAlert, UserRound } from 'lucide-react'
import { riskFor } from '../data.js'
import { RiskGauge, StatusPill } from './ui.jsx'

const steps = [
  { level: 1, label: 'Observe', copy: 'Increase monitoring, no friction.' },
  { level: 2, label: 'Step-up MFA', copy: 'Verify identity before the next command.' },
  { level: 3, label: 'Shorten TTL', copy: 'Reduce the privileged session lifetime.' },
  { level: 4, label: 'Quarantine read-only', copy: 'Withdraw write scope, keep visibility.' },
  { level: 5, label: 'Terminate', copy: 'End session after human approval.' },
]

export function SessionInspector({ session, mode, applyContainment, requireMfa, openCase, hasCase }) {
  const risk = riskFor(session, mode)
  const activeLevel = session.status === 'terminated' ? 5 : session.status === 'quarantined' ? 4 : session.control.includes('TTL') ? 3 : session.control.includes('MFA') || session.control.includes('Step-up') ? 2 : 1
  return (
    <aside className="panel inspector">
      <div className="inspector__header">
        <div className="inspector__eyeline"><span>Selected session</span><span>Updated: 10:24:15 <RotateCw /></span></div>
        <div className="inspector__identity">
          <span className="identity-avatar"><UserRound /></span>
          <div><h2>{session.person}</h2><p>{session.email}</p></div>
          <RiskGauge value={risk} />
          <StatusPill tone={risk >= 90 ? 'danger' : risk >= 70 ? 'warning' : 'success'}>{risk >= 90 ? 'Critical risk' : risk >= 70 ? 'High risk' : risk >= 40 ? 'Elevated' : 'Low risk'}</StatusPill>
        </div>
        <div className="inspector__facts">
          <span><Database /><span><b>{session.target}</b><small>{session.engine}</small></span></span>
          <span><Link2 /><span><b>{session.ticket ?? 'No ticket'}</b><small>{session.binding} · {session.confidence}</small></span></span>
          <span><Shield /><span><b>Mode</b><small>{mode === 'rules' ? 'Rules only' : mode === 'ml' ? 'ML only' : 'Combined'}</small></span></span>
          <span><Clock3 /><span><b>Start</b><small>{session.started}</small></span></span>
        </div>
      </div>

      <div className="inspector__body">
        <div className="inspector__main">
          <section className="deviations">
            <h3>Top deviations <span>(why this is {risk >= 70 ? 'high risk' : 'the current score'})</span></h3>
            <ul>{session.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
          </section>
          <section className="ladder">
            <div className="section-title"><h3>Reversible containment ladder</h3><ShieldAlert /></div>
            <div className="ladder__rail">
              {steps.map((step) => (
                <button key={step.level} type="button" className={`${activeLevel === step.level ? 'is-active' : ''} ${step.level === 5 ? 'is-human' : ''}`} onClick={() => applyContainment(step.level)}>
                  <span className="ladder__level">L{step.level}</span>
                  <span><b>{step.label}</b><small>{step.copy}</small></span>
                  <em>{step.level === 5 ? 'Human only' : activeLevel === step.level ? 'Active' : 'Available'}</em>
                </button>
              ))}
            </div>
          </section>
        </div>
        <div className="inspector__actions">
          <button className="primary-action" type="button" onClick={() => requireMfa(session.id)}><KeyRound />Require step-up MFA</button>
          <button className="secondary-action" type="button" onClick={openCase}><FilePlus2 />{hasCase ? 'View open case' : 'Open case'}</button>
          <div className={`case-state ${hasCase ? 'has-case' : ''}`}>
            {hasCase ? <LockKeyhole /> : <AlertTriangle />}
            <strong>{hasCase ? 'Case linked' : 'No case yet'}</strong>
            <p>{hasCase ? 'Every decision and analyst action is being preserved.' : 'Create a case to track this incident.'}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
