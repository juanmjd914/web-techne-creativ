import { useState } from 'react'
import { motion } from 'motion/react'
import { CalendarCheck, CheckCircle, Clock, Video } from 'lucide-react'
import { API_URL, SERVICES_FOR_BOOKING } from '../lib/config'
import { SEOHead } from '../components/SEOHead'

interface FormState {
  name: string
  email: string
  whatsapp: string
  service: string
  date: string
  time: string
  message: string
}

const INIT: FormState = { name: '', email: '', whatsapp: '', service: '', date: '', time: '', message: '' }

const SLOTS_WEEKDAY = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

const SLOTS_SATURDAY = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00',
]

function getTodayString() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

function getDayOfWeek(dateStr: string): number {
  if (!dateStr) return -1
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
}

function getSlotsForDate(dateStr: string): string[] {
  const dow = getDayOfWeek(dateStr)
  if (dow === 0) return []
  if (dow === 6) return SLOTS_SATURDAY
  return SLOTS_WEEKDAY
}

export function AgendarCita() {
  const [form, setForm] = useState<FormState>(INIT)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [err, setErr] = useState('')

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value
    if (k === 'date') {
      const dow = getDayOfWeek(val)
      if (dow === 0) return
      setForm(f => ({ ...f, date: val, time: '' }))
    } else {
      setForm(f => ({ ...f, [k]: val }))
    }
  }

  const availableSlots = getSlotsForDate(form.date)
  const isDaySunday = getDayOfWeek(form.date) === 0

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErr('')
    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error')
      setStatus('success')
      setForm(INIT)
    } catch {
      setStatus('error')
      setErr('Hubo un error. Por favor escríbenos por WhatsApp.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--tc-border)',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'var(--font)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    background: '#fff',
  }

  return (
    <main style={{ paddingTop: 68 }}>
      <SEOHead
        title="Agendar Cita Gratuita — Consultoría Digital"
        description="Agenda una consultoría gratuita de 30 minutos por Google Meet. Analizamos tu negocio y te decimos exactamente qué necesitas para crecer digitalmente."
        path="/agendar-cita"
      />
      {/* Hero */}
      <section style={{ padding: '72px 24px 60px', background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FA 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p className="section-eyebrow">Agendar cita</p>
          <h1 className="section-title" style={{ marginTop: 12 }}>Reserva tu consultoría gratuita</h1>
          <p className="section-subtitle" style={{ marginTop: 16, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            30 minutos donde analizamos tu negocio y te decimos exactamente qué necesitas para crecer digitalmente.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <Video size={14} />, text: 'Reunión virtual o presencial' },
              { icon: <Clock size={14} />, text: '30 minutos' },
              { icon: <CheckCircle size={14} />, text: '100% gratuita' },
            ].map(b => (
              <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,188,212,0.12)', color: 'var(--tc-primary-dark)', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 60, alignItems: 'flex-start' }}>
          {/* Info */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tc-text)', marginBottom: 8 }}>¿Qué pasa en la cita?</h2>
            <p style={{ fontSize: 14, color: 'var(--tc-muted)', lineHeight: 1.75, marginBottom: 28 }}>
              En 30 minutos analizamos tu situación actual, identificamos las oportunidades de crecimiento digital y te explicamos cómo podemos ayudarte.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { n: '1', title: 'Diagnóstico rápido', desc: 'Revisamos tu presencia digital actual y la de tu competencia.' },
                { n: '2', title: 'Propuesta de solución', desc: 'Te decimos qué necesitas y cómo lo implementaríamos.' },
                { n: '3', title: 'Cotización orientativa', desc: 'Te damos una idea de costos y tiempos sin compromiso.' },
                { n: '4', title: 'Próximos pasos', desc: 'Si decides avanzar, te explicamos cómo funciona el proceso.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0BBEC8, #0CC4A0)', color: '#fff', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.n}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--tc-text)', margin: 0, marginBottom: 4 }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: 'var(--tc-muted)', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 36, padding: '20px 24px', background: 'var(--tc-primary-light)', borderRadius: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--tc-primary-dark)', margin: 0, lineHeight: 1.6 }}>
                <strong>¿Prefieres escribirnos?</strong><br />
                <a href="https://wa.me/56965174454?text=Hola%2C%20quiero%20agendar%20una%20cita%20para%20hablar%20de%20mi%20proyecto" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tc-primary-dark)', fontWeight: 600 }}>
                  Escríbenos por WhatsApp →
                </a>
              </p>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: '#fff', border: '1px solid var(--tc-border)', borderRadius: 20, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CalendarCheck size={36} style={{ color: '#22C55E' }} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tc-text)', marginBottom: 10 }}>¡Cita agendada!</h3>
                <p style={{ fontSize: 14, color: 'var(--tc-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                  Te enviaremos un correo de confirmación y te escribiremos por WhatsApp para confirmar los detalles de la reunión.
                </p>
                <button onClick={() => setStatus('idle')} className="btn-outline" style={{ margin: '0 auto' }}>
                  Agendar otra cita
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--tc-text)', margin: 0, marginBottom: 4 }}>Reservar cita gratuita</h3>
                {[
                  { label: 'Nombre completo *', key: 'name' as const, type: 'text', placeholder: 'Tu nombre completo' },
                  { label: 'Correo electrónico *', key: 'email' as const, type: 'email', placeholder: 'tu@email.com' },
                  { label: 'WhatsApp *', key: 'whatsapp' as const, type: 'tel', placeholder: '+56 9 1234 5678' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={set(f.key)}
                      placeholder={f.placeholder}
                      required
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--tc-primary)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--tc-border)')}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>Servicio de interés *</label>
                  <select value={form.service} onChange={set('service')} required style={inputStyle}>
                    <option value="">Seleccionar...</option>
                    {SERVICES_FOR_BOOKING.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>Fecha preferida *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={set('date')}
                      min={getTodayString()}
                      required
                      style={{ ...inputStyle, borderColor: isDaySunday ? '#EF4444' : undefined }}
                      onFocus={e => (e.target.style.borderColor = 'var(--tc-primary)')}
                      onBlur={e => (e.target.style.borderColor = isDaySunday ? '#EF4444' : 'var(--tc-border)')}
                    />
                    {isDaySunday && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0' }}>No atendemos los domingos</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>Hora preferida *</label>
                    <select value={form.time} onChange={set('time')} required style={inputStyle} disabled={!form.date || isDaySunday}>
                      <option value="">{!form.date ? 'Elige fecha primero' : 'Seleccionar...'}</option>
                      {availableSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>Cuéntanos brevemente sobre tu negocio</label>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tipo de negocio, qué producto o servicio ofreces, qué necesitas..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--tc-primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--tc-border)')}
                  />
                </div>
                {err && <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{err}</p>}
                <button type="submit" className="btn-teal" disabled={status === 'loading'} style={{ justifyContent: 'center' }}>
                  {status === 'loading' ? 'Agendando...' : <><CalendarCheck size={16} /> Agendar cita gratis</>}
                </button>
                <p style={{ fontSize: 12, color: 'var(--tc-muted)', textAlign: 'center', margin: 0 }}>
                  Confirmaremos tu cita en menos de 24 horas por email y WhatsApp.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
