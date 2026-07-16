import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronRight, FileJson2, KeyRound, Link2, LockKeyhole, Search, ShieldCheck } from 'lucide-react'
import { StatusPill } from '../components/ui.jsx'

export function AttestationsPage({ attestations, notify }) {
  const [selected, setSelected] = useState(attestations[0])
  const [verdict, setVerdict] = useState(selected.verdict)

  const select = (item) => { setSelected(item); setVerdict(item.verdict) }
  const verify = () => { setVerdict(selected.verdict); notify('Evidence verified', `${selected.id} passed signature, decryption, and hash-chain checks.`) }
  const tamper = () => { setVerdict('INVALID'); notify('Tampering detected', 'Verifier located the first broken hash-chain link at event EVT-000913.', 'danger') }

  return (
    <div className="page-stack">
      <div className="page-intro"><p>Portable change evidence is signed, encrypted, and independently verifiable.</p><div className="page-tools"><label><Search /><input aria-label="Search attestations" placeholder="Search change or attestation" /></label></div></div>
      <div className="attestation-layout">
        <section className="panel attestation-list">
          <div className="panel-heading"><div><h2>Sealed attestations</h2><p>Retention-safe evidence packages</p></div></div>
          {attestations.map((item) => (
            <button key={item.id} className={selected.id === item.id ? 'is-active' : ''} type="button" onClick={() => select(item)}>
              <FileJson2 />
              <span><strong>{item.change}</strong><small>{item.id}</small></span>
              <span>{item.actor}<small>{item.events} events · {item.sealed}</small></span>
              <StatusPill tone={item.verdict === 'VERIFIED' ? 'success' : 'warning'}>{item.verdict}</StatusPill>
              <ChevronRight />
            </button>
          ))}
        </section>
        <section className={`panel verifier verifier--${verdict.toLowerCase()}`}>
          <div className="verifier__verdict">{verdict === 'VERIFIED' ? <CheckCircle2 /> : <AlertTriangle />}<div><span>Verification result</span><strong>{verdict}</strong><small>{verdict === 'INVALID' ? 'Broken chain at EVT-000913' : verdict === 'GAP' ? 'Delayed telemetry left a checkpoint gap' : 'All independent checks passed'}</small></div></div>
          <div className="crypto-chain">
            <span><ShieldCheck /><b>ML-DSA-65</b><small>FIPS 204 signature</small></span>
            <i />
            <span><KeyRound /><b>ML-KEM-768</b><small>FIPS 203 key wrap</small></span>
            <i />
            <span><LockKeyhole /><b>AES-256-GCM</b><small>Evidence bundle</small></span>
            <i />
            <span><Link2 /><b>{selected.events} events</b><small>Hash chain complete</small></span>
          </div>
          <dl className="manifest-facts"><div><dt>Attestation</dt><dd>{selected.id}</dd></div><div><dt>Change</dt><dd>{selected.change}</dd></div><div><dt>Actor</dt><dd>{selected.actor}</dd></div><div><dt>Signer key</dt><dd>cbq-signer-01</dd></div><div><dt>Provider</dt><dd>Prototype crypto adapter</dd></div><div><dt>Ingestion delayed</dt><dd>{selected.delayed ? 'Yes' : 'No'}</dd></div></dl>
          <div className="verifier__actions"><button className="primary-action" type="button" onClick={verify}>Verify package</button><button className="danger-action" type="button" onClick={tamper}>Tamper one byte</button></div>
          <p className="prototype-note">Prototype note: this UI models the manifest, algorithm metadata, and verification states. Production deployment requires a certified PQC provider, HSM/KMS custody, rotation, and hybrid migration policy.</p>
        </section>
      </div>
    </div>
  )
}
