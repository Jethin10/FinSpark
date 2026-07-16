import { useEffect } from 'react'
import { AlertTriangle, Check, Info, X } from 'lucide-react'

export function RiskGauge({ value, size = 'md' }) {
  const tone = value >= 90 ? 'critical' : value >= 70 ? 'high' : value >= 40 ? 'medium' : 'low'
  return (
    <div className={`risk-gauge risk-gauge--${size} risk-gauge--${tone}`} style={{ '--risk': `${value * 3.6}deg` }} aria-label={`Risk score ${value} out of 100`}>
      <span>{String(value).padStart(2, '0')}</span>
      {size !== 'sm' ? <small>/100</small> : null}
    </div>
  )
}

export function StatusPill({ children, tone = 'neutral' }) {
  return <span className={`status-pill status-pill--${tone}`}>{children}</span>
}

export function ModeSwitch({ value, onChange, compact = false }) {
  const modes = [
    ['rules', 'Rules only'],
    ['ml', 'ML only'],
    ['combined', 'Combined'],
  ]
  return (
    <div className={`mode-switch ${compact ? 'mode-switch--compact' : ''}`} role="group" aria-label="Analysis mode">
      {modes.map(([id, label]) => (
        <button key={id} type="button" className={value === id ? 'is-active' : ''} onClick={() => onChange(id)} aria-pressed={value === id}>
          {label}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({ icon: Icon = Info, title, copy }) {
  return (
    <div className="empty-state">
      <Icon aria-hidden="true" />
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  )
}

export function Toast({ title, message, tone = 'success', onClose }) {
  useEffect(() => {
    const id = window.setTimeout(onClose, 4600)
    return () => window.clearTimeout(id)
  }, [onClose])
  const Icon = tone === 'danger' ? AlertTriangle : tone === 'neutral' ? Info : Check
  return (
    <div className={`toast toast--${tone}`} role="status">
      <Icon aria-hidden="true" />
      <div><strong>{title}</strong><p>{message}</p></div>
      <button type="button" onClick={onClose} aria-label="Dismiss notification"><X /></button>
    </div>
  )
}
