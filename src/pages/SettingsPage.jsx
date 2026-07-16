import { Activity, DatabaseZap, Play, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react'

export function SettingsPage({ controlPlaneOnline, runScenario }) {
  return (
    <div className="page-stack settings-page">
      <div className="page-intro"><p>These controls exist for prototype rehearsal. They do not represent production administration.</p></div>
      <section className="panel demo-settings">
        <div className="panel-heading"><div><h2>Demo control room</h2><p>Reproduce the four strongest judge-facing moments without live typing</p></div></div>
        <div className="scenario-grid">
          <button type="button" onClick={() => runScenario('denial')}><DatabaseZap /><span><b>Flow B · Native denial</b><small>PostgreSQL blocks customers_raw; ChangeBound Q records the attempt.</small></span><Play /></button>
          <button type="button" onClick={() => runScenario('ghost')}><ShieldCheck /><span><b>Flow C · Ghost session</b><small>Surface a direct privileged connection with no approved binding.</small></span><Play /></button>
          <button type="button" onClick={() => runScenario('anomaly')}><Activity /><span><b>Flow D · AI anomaly</b><small>Show a rules-green session becoming high risk in combined mode.</small></span><Play /></button>
          <button type="button" onClick={() => runScenario('failsafe')}>{controlPlaneOnline ? <ToggleRight /> : <ToggleLeft />}<span><b>Flow F · Fail-safe</b><small>{controlPlaneOnline ? 'Stop the control plane while native database access remains available.' : 'Restore the control plane and replay delayed audit events.'}</small></span><Play /></button>
        </div>
      </section>
    </div>
  )
}
