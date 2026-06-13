import { useState, useEffect } from 'react'
import { Heart, Plus, Trash2, TrendingUp, AlertCircle, CheckCircle, Calendar } from 'lucide-react'

const ACCENT = '#ef4444'

interface Reading {
  id: string
  date: string
  systolic: number
  diastolic: number
  pulse: number
  notes: string
}

function classify(s: number, d: number): { label: string; color: string; icon: string } {
  if (s < 120 && d < 80) return { label: 'Normal', color: '#22c55e', icon: '✓' }
  if (s < 130 && d < 80) return { label: 'Elevated', color: '#f59e0b', icon: '↑' }
  if (s < 140 || d < 90) return { label: 'High Stage 1', color: '#f97316', icon: '⚠' }
  if (s >= 140 || d >= 90) return { label: 'High Stage 2', color: '#ef4444', icon: '!!' }
  return { label: 'Unknown', color: '#64748b', icon: '?' }
}

export default function App() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [sys, setSys] = useState('')
  const [dia, setDia] = useState('')
  const [pulse, setPulse] = useState('')
  const [notes, setNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const [tab, setTab] = useState<'readings' | 'trends'>('readings')

  useEffect(() => {
    const saved = localStorage.getItem('bp_readings')
    if (saved) setReadings(JSON.parse(saved))
  }, [])

  function save(list: Reading[]) { setReadings(list); localStorage.setItem('bp_readings', JSON.stringify(list)) }

  function addReading() {
    if (!sys || !dia) return
    const r: Reading = { id: Date.now().toString(), date: new Date().toISOString(), systolic: Number(sys), diastolic: Number(dia), pulse: Number(pulse) || 0, notes: notes.trim() }
    save([r, ...readings])
    setSys(''); setDia(''); setPulse(''); setNotes(''); setAdding(false)
  }

  const avg7 = readings.slice(0, 7)
  const avgSys = avg7.length ? Math.round(avg7.reduce((a, r) => a + r.systolic, 0) / avg7.length) : null
  const avgDia = avg7.length ? Math.round(avg7.reduce((a, r) => a + r.diastolic, 0) / avg7.length) : null

  return (
    <div style={{ background: '#0a0005', minHeight: '100vh', fontFamily: 'Inter,sans-serif', color: '#fff', padding: '1.5rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Heart size={26} style={{ color: ACCENT }} />
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>Blood Pressure Log</h1>
          </div>
          <button onClick={() => setAdding(true)} style={{ background: ACCENT, border: 'none', borderRadius: 12, padding: '0.6rem 1.2rem', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={16} /> Add</button>
        </div>

        {avgSys !== null && (
          <div style={{ background: '#1a0010', borderRadius: 16, padding: '1.2rem', marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ color: ACCENT, fontSize: 32, fontWeight: 900 }}>{avgSys}/{avgDia}</p>
              <p style={{ color: '#64748b', fontSize: 12 }}>7-day avg mmHg</p>
            </div>
            <div style={{ flex: 1 }}>
              {avgSys !== null && avgDia !== null && (() => { const c = classify(avgSys, avgDia); return (<div style={{ textAlign: 'center' }}><span style={{ background: c.color + '22', color: c.color, borderRadius: 20, padding: '0.4rem 1rem', fontSize: 14, fontWeight: 700 }}>{c.label}</span></div>) })()}
            </div>
          </div>
        )}

        {adding && (
          <div style={{ background: '#1a0010', borderRadius: 16, padding: '1.5rem', marginBottom: 16, border: '1px solid #3d0020' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>New Reading</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Systolic (top)</label>
                <input type="number" value={sys} onChange={e => setSys(e.target.value)} placeholder="e.g. 120" style={{ width: '100%', background: '#0a0005', border: '1px solid #3d0020', borderRadius: 8, padding: '0.7rem', color: '#fff', fontSize: 18, fontWeight: 700, textAlign: 'center', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Diastolic (bottom)</label>
                <input type="number" value={dia} onChange={e => setDia(e.target.value)} placeholder="e.g. 80" style={{ width: '100%', background: '#0a0005', border: '1px solid #3d0020', borderRadius: 8, padding: '0.7rem', color: '#fff', fontSize: 18, fontWeight: 700, textAlign: 'center', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Pulse (bpm)</label>
                <input type="number" value={pulse} onChange={e => setPulse(e.target.value)} placeholder="e.g. 72" style={{ width: '100%', background: '#0a0005', border: '1px solid #3d0020', borderRadius: 8, padding: '0.7rem', color: '#fff', fontSize: 18, fontWeight: 700, textAlign: 'center', boxSizing: 'border-box' }} />
              </div>
            </div>
            {sys && dia && (() => { const c = classify(Number(sys), Number(dia)); return <p style={{ color: c.color, fontSize: 14, marginBottom: 8, fontWeight: 600 }}>{c.icon} {c.label}</p> })()}
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" style={{ width: '100%', background: '#0a0005', border: '1px solid #3d0020', borderRadius: 8, padding: '0.6rem', color: '#fff', fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addReading} style={{ background: ACCENT, border: 'none', borderRadius: 10, padding: '0.6rem 1.2rem', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Save</button>
              <button onClick={() => setAdding(false)} style={{ background: '#2a0015', border: 'none', borderRadius: 10, padding: '0.6rem 1.2rem', color: '#888', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ background: '#14001a', borderRadius: 12, padding: '0.5rem', marginBottom: 16, display: 'flex', gap: 4 }}>
          {(['readings', 'trends'] as const).map(t => <button key={t} onClick={() => setTab(t)} style={{ flex: 1, background: tab === t ? ACCENT : 'transparent', border: 'none', borderRadius: 8, padding: '0.5rem', color: tab === t ? '#fff' : '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>)}
        </div>

        {tab === 'readings' && (
          readings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#3d0020' }}>
              <Heart size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ color: '#6b0030' }}>No readings yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {readings.map(r => {
                const c = classify(r.systolic, r.diastolic)
                return (
                  <div key={r.id} style={{ background: '#14001a', borderRadius: 12, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #2a0015' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{r.systolic}/{r.diastolic}</span>
                        <span style={{ color: '#64748b', fontSize: 12 }}>mmHg</span>
                        {r.pulse > 0 && <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 8 }}>♥ {r.pulse} bpm</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ color: c.color, fontSize: 12, fontWeight: 600 }}>{c.label}</span>
                        <span style={{ color: '#475569', fontSize: 12 }}>· {new Date(r.date).toLocaleDateString()} {new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <button onClick={() => { const list = readings.filter(x => x.id !== r.id); save(list) }} style={{ background: 'transparent', border: 'none', color: '#3d0020', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </div>
                )
              })}
            </div>
          )
        )}

        {tab === 'trends' && (
          <div>
            <div style={{ background: '#14001a', borderRadius: 16, padding: '1.2rem' }}>
              <h3 style={{ color: '#64748b', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>BP Ranges Guide</h3>
              {[
                { range: '< 120/80', label: 'Normal', color: '#22c55e' },
                { range: '120-129/<80', label: 'Elevated', color: '#f59e0b' },
                { range: '130-139/80-89', label: 'High Stage 1', color: '#f97316' },
                { range: '≥140/≥90', label: 'High Stage 2', color: '#ef4444' },
                { range: '≥180/≥120', label: 'Crisis', color: '#7f1d1d' },
              ].map(({ range, label, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #2a0015' }}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>{range}</span>
                  <span style={{ color, fontSize: 13, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
              <p style={{ color: '#475569', fontSize: 11, marginTop: 12 }}>⚠ This app is for tracking only, not medical advice.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
