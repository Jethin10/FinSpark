import { Filter, Play, Search, SlidersHorizontal } from 'lucide-react'
import { SessionInspector } from '../components/SessionInspector.jsx'
import { SessionTable } from '../components/SessionTable.jsx'

export function SessionsPage({ mode, setMode, sessions, selectedSession, setSelectedId, cases, applyContainment, requireMfa, openCase, runScenario }) {
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div><p>Observe identity, intent, behavior, and control state without losing the database context.</p></div>
        <div className="page-tools">
          <label><Search /><input aria-label="Search sessions" placeholder="Filter identities or targets" /></label>
          <button type="button"><Filter />Filter</button>
          <button type="button"><SlidersHorizontal />Columns</button>
          <button className="primary-action compact" type="button" onClick={() => runScenario('ghost')}><Play />Inject ghost-session demo</button>
        </div>
      </div>
      <div className="sessions-layout">
        <SessionTable sessions={sessions} selectedId={selectedSession.id} onSelect={setSelectedId} mode={mode} setMode={setMode} expanded />
        <SessionInspector session={selectedSession} mode={mode} applyContainment={applyContainment} requireMfa={requireMfa} openCase={openCase} hasCase={cases.some((item) => item.sessionId === selectedSession.id)} />
      </div>
    </div>
  )
}
