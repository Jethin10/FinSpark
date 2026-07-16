import { useMemo, useState } from 'react'
import { attestations, initialCases, initialSessions, riskFor, timelineSeed } from './data.js'
import { AppShell } from './components/AppShell.jsx'
import { OverviewPage } from './pages/OverviewPage.jsx'
import { SessionsPage } from './pages/SessionsPage.jsx'
import { CasesPage } from './pages/CasesPage.jsx'
import { AttestationsPage } from './pages/AttestationsPage.jsx'
import { CoveragePage } from './pages/CoveragePage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'
import { Toast } from './components/ui.jsx'

const pageTitles = {
  overview: 'Security Overview',
  sessions: 'Privileged Sessions',
  cases: 'Investigation Cases',
  attestations: 'Quantum-safe Attestations',
  coverage: 'Coverage & Trust Boundaries',
  settings: 'Prototype Settings',
}

export default function App() {
  const [page, setPage] = useState('overview')
  const [mode, setMode] = useState('combined')
  const [sessions, setSessions] = useState(initialSessions)
  const [selectedId, setSelectedId] = useState('PS-7814')
  const [cases, setCases] = useState(initialCases)
  const [timeline, setTimeline] = useState(timelineSeed)
  const [toast, setToast] = useState(null)
  const [controlPlaneOnline, setControlPlaneOnline] = useState(true)

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedId) ?? sessions[0],
    [selectedId, sessions],
  )

  const notify = (title, message, tone = 'success') => {
    setToast({ title, message, tone, key: Date.now() })
  }

  const updateSession = (id, patch) => {
    setSessions((current) => current.map((session) => (session.id === id ? { ...session, ...patch } : session)))
  }

  const requireMfa = (id = selectedSession.id) => {
    updateSession(id, { control: 'MFA challenge active', status: 'elevated' })
    setTimeline((current) => current.map((item) => item.label === 'MFA required' ? { ...item, detail: 'Challenge sent', time: '02:41:12', state: 'done' } : item))
    notify('Step-up challenge sent', 'The broker will pause the next privileged command until identity is re-verified.')
  }

  const applyContainment = (level) => {
    const changes = {
      1: { control: 'Enhanced logging' },
      2: { control: 'MFA challenge active', status: 'elevated' },
      3: { control: 'TTL shortened · 15m', status: 'elevated' },
      4: { control: 'Quarantined read-only', status: 'quarantined' },
      5: { control: 'Session terminated', status: 'terminated' },
    }
    updateSession(selectedSession.id, changes[level])
    notify(level === 5 ? 'Session terminated by analyst' : `Containment L${level} applied`, level === 5 ? 'Human approval was recorded in the evidence chain.' : 'The action is reversible and has been added to the evidence chain.', level === 5 ? 'danger' : 'success')
  }

  const openCase = () => {
    const existing = cases.find((item) => item.sessionId === selectedSession.id)
    if (existing) {
      notify('Case already open', `${existing.id} is tracking this session.`, 'neutral')
      return
    }
    const caseId = `CASE-${1843 + cases.length}`
    setCases((current) => [{ id: caseId, sessionId: selectedSession.id, title: `${selectedSession.person} · ${selectedSession.control}`, severity: riskFor(selectedSession, mode) >= 80 ? 'High' : 'Medium', owner: 'SOC Queue', status: 'Open', age: 'now' }, ...current])
    notify('Investigation case created', `${caseId} includes the ticket, identity, commands, risk reasons, and containment history.`)
  }

  const runScenario = (scenario) => {
    if (scenario === 'ghost') {
      setSelectedId('LEG-0019')
      setPage('overview')
      notify('Ghost session detected', 'dba_legacy connected directly with no approved change binding.', 'danger')
    }
    if (scenario === 'anomaly') {
      setSelectedId('PS-7814')
      setMode('combined')
      setPage('overview')
      notify('Behavioral anomaly detected', 'Rules remain green; the model found three strong deviations.', 'danger')
    }
    if (scenario === 'denial') {
      updateSession('PS-7781', { baseRisk: 42, mlRisk: 61, control: 'Native denial · case opened', status: 'elevated', reasons: ['PostgreSQL denied customers_raw', 'First-ever object reference', 'Approved role remained unchanged'] })
      setSelectedId('PS-7781')
      setPage('overview')
      notify('Native denial observed', 'PostgreSQL blocked access to customers_raw before ChangeBound Q responded.', 'danger')
    }
    if (scenario === 'failsafe') {
      setControlPlaneOnline((online) => !online)
      notify(controlPlaneOnline ? 'Control plane stopped' : 'Control plane restored', controlPlaneOnline ? 'Granted database sessions continue. Telemetry will back-fill after recovery.' : 'Delayed events were replayed and marked in the attestation.', 'neutral')
    }
  }

  const shared = {
    mode,
    setMode,
    sessions,
    selectedSession,
    setSelectedId,
    cases,
    applyContainment,
    requireMfa,
    openCase,
    runScenario,
    controlPlaneOnline,
  }

  const pages = {
    overview: <OverviewPage {...shared} timeline={timeline} />,
    sessions: <SessionsPage {...shared} />,
    cases: <CasesPage cases={cases} sessions={sessions} notify={notify} />,
    attestations: <AttestationsPage attestations={attestations} notify={notify} />,
    coverage: <CoveragePage />,
    settings: <SettingsPage controlPlaneOnline={controlPlaneOnline} runScenario={runScenario} />,
  }

  return (
    <AppShell page={page} setPage={setPage} title={pageTitles[page]} controlPlaneOnline={controlPlaneOnline} runScenario={runScenario}>
      {pages[page]}
      {toast ? <Toast key={toast.key} {...toast} onClose={() => setToast(null)} /> : null}
    </AppShell>
  )
}
