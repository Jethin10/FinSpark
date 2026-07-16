import { useState } from 'react'
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Command,
  FileCheck2,
  Gauge,
  Globe2,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'sessions', label: 'Sessions', icon: Users },
  { id: 'cases', label: 'Cases', icon: BriefcaseBusiness },
  { id: 'attestations', label: 'Attestations', icon: FileCheck2 },
  { id: 'coverage', label: 'Coverage', icon: Globe2 },
]

export function AppShell({ page, setPage, title, controlPlaneOnline, runScenario, children }) {
  const [demoOpen, setDemoOpen] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  const navigate = (id) => {
    setPage(id)
    setMobileNav(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="brand">
          <span className="brand__mark"><ShieldCheck /></span>
          <span>ChangeBound <b>Q</b></span>
          <button className="sidebar__close" type="button" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button>
        </div>
        <nav aria-label="Primary navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={page === id ? 'is-active' : ''} type="button" onClick={() => navigate(id)}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </button>
          ))}
        </nav>
        <button className={`sidebar__settings ${page === 'settings' ? 'is-active' : ''}`} type="button" onClick={() => navigate('settings')}>
          <Settings aria-hidden="true" /><span>Settings</span>
        </button>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <div className="topbar__title">
            <button className="mobile-menu" type="button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Command /></button>
            <h1>{title}</h1>
          </div>
          <label className="global-search">
            <Search aria-hidden="true" />
            <input type="search" placeholder="Search sessions, identities, tickets..." aria-label="Global search" />
            <kbd>⌘K</kbd>
          </label>
          <div className="topbar__actions">
            <span className={`system-state ${controlPlaneOnline ? '' : 'is-degraded'}`}><i />{controlPlaneOnline ? 'All systems operational' : 'Control plane offline · DB unaffected'}</span>
            <button className="icon-button" type="button" aria-label="Notifications"><Bell /></button>
            <button className="demo-button" type="button" onClick={() => setDemoOpen((open) => !open)} aria-expanded={demoOpen}>
              <Play /> Run demo <ChevronDown />
            </button>
            <span className="avatar" aria-label="Signed in as Ravi Kumar">RK</span>
          </div>
          {demoOpen ? (
            <div className="demo-menu">
              <span>Rehearsal-ready flows</span>
              <button type="button" onClick={() => { runScenario('denial'); setDemoOpen(false) }}><b>Flow B</b><small>Native denial</small></button>
              <button type="button" onClick={() => { runScenario('ghost'); setDemoOpen(false) }}><b>Flow C</b><small>Ghost session</small></button>
              <button type="button" onClick={() => { runScenario('anomaly'); setDemoOpen(false) }}><b>Flow D</b><small>Behavior anomaly</small></button>
              <button type="button" onClick={() => { runScenario('failsafe'); setDemoOpen(false) }}><b>Flow F</b><small>{controlPlaneOnline ? 'Stop control plane' : 'Restore control plane'}</small></button>
            </div>
          ) : null}
        </header>
        <main>{children}</main>
      </div>
      {mobileNav ? <button className="scrim" type="button" aria-label="Close navigation" onClick={() => setMobileNav(false)} /> : null}
    </div>
  )
}
