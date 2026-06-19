import { useState } from 'react'
import { motion } from 'motion/react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { API_URL } from '../lib/config'
import { SEOHead } from '../components/SEOHead'

const SERVICES = [
  'Página web', 'E-commerce', 'Branding', 'Community Management',
  'Publicidad digital', 'Catálogo WhatsApp', 'Marketing integral', 'Otro',
]

interface FormState {
  name: string
  email: string
  whatsapp: string
  service: string
  message: string
}

const INIT: FormState = { name: '', email: '', whatsapp: '', service: '', message: '' }

export function Contacto() {
  const [form, setForm] = useState<FormState>(INIT)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [err, setErr] = useState('')

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErr('')
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al enviar')
      setStatus('success')
      setForm(INIT)
    } catch {
      setStatus('error')
      setErr('Hubo un error al enviar. Escríbenos directamente por WhatsApp.')
    }
  }

  return (
    <main style={{ paddingTop: 68 }}>
      <SEOHead
        title="Contacto — Escríbenos"
        description="¿Tienes un proyecto en mente? Escríbenos y te respondemos en menos de 24 horas. Atendemos en Chile y Venezuela."
        path="/contacto"
      />
      {/* Hero */}
      <section style={{ padding: '72px 24px 60px', background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FA 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p className="section-eyebrow">Contacto</p>
          <h1 className="section-title" style={{ marginTop: 12 }}>Hablemos de tu proyecto</h1>
          <p className="section-subtitle" style={{ marginTop: 16, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Rellena el formulario y te respondemos en menos de 24 horas. Sin compromiso.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div className="responsive-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 60, alignItems: 'flex-start' }}>
          {/* Contact info */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--tc-text)', marginBottom: 8 }}>Información de contacto</h2>
            <p style={{ fontSize: 14, color: 'var(--tc-muted)', lineHeight: 1.7, marginBottom: 32 }}>
              Preferes el directo? Escríbenos por WhatsApp y te atendemos al instante.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: <Mail size={18} />, label: 'Email', value: 'ventas@technecreativ.com', href: 'mailto:ventas@technecreativ.com' },
                { icon: <Phone size={18} />, label: 'WhatsApp Chile', value: '+56 9 6517 4454', href: 'https://wa.me/56965174454' },
                { icon: <Phone size={18} />, label: 'WhatsApp Venezuela', value: '+58 424 651 5707', href: 'https://wa.me/584246515707' },
                { icon: <MapPin size={18} />, label: 'Sede Chile', value: 'Rancagua, Región de O\'Higgins, Chile', href: undefined },
                { icon: <MapPin size={18} />, label: 'Sede Venezuela', value: 'Barquisimeto, Estado Lara, Venezuela', href: undefined },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--tc-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-primary)', flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--tc-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{c.label}</p>
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: 'var(--tc-text)', textDecoration: 'none', fontWeight: 500 }}>{c.value}</a>
                    ) : (
                      <p style={{ fontSize: 14, color: 'var(--tc-text)', margin: 0, fontWeight: 500 }}>{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, padding: '20px 24px', background: '#F0FDF4', borderRadius: 12, borderLeft: '4px solid #22C55E' }}>
              <p style={{ fontSize: 13, color: '#166534', margin: 0, lineHeight: 1.6 }}>
                <strong>Horario de atención:</strong><br />
                Lun–Vie: 9:00 AM – 6:00 PM (hora Chile)<br />
                Respondemos WhatsApp hasta las 9:00 PM
              </p>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: '#fff', border: '1px solid var(--tc-border)', borderRadius: 20, padding: 36, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle size={48} style={{ color: '#22C55E', marginBottom: 16 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--tc-text)', marginBottom: 8 }}>¡Mensaje enviado!</h3>
                <p style={{ fontSize: 14, color: 'var(--tc-muted)', lineHeight: 1.7 }}>
                  Te contactaremos en menos de 24 horas al correo o WhatsApp que dejaste.
                </p>
                <button onClick={() => setStatus('idle')} className="btn-teal" style={{ marginTop: 24 }}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--tc-text)', margin: 0, marginBottom: 4 }}>Envíanos un mensaje</h3>
                {[
                  { label: 'Nombre completo *', key: 'name' as const, type: 'text', placeholder: 'Tu nombre' },
                  { label: 'Correo electrónico *', key: 'email' as const, type: 'email', placeholder: 'tu@email.com' },
                  { label: 'WhatsApp', key: 'whatsapp' as const, type: 'tel', placeholder: '+56 9 ...' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={set(f.key)}
                      placeholder={f.placeholder}
                      required={f.label.includes('*')}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--tc-border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font)', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--tc-primary)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--tc-border)')}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>Servicio de interés</label>
                  <select
                    value={form.service}
                    onChange={set('service')}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--tc-border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font)', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="">Seleccionar servicio...</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tc-text)', marginBottom: 6 }}>Mensaje *</label>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Cuéntanos sobre tu proyecto o consulta..."
                    required
                    rows={4}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--tc-border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font)', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--tc-primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--tc-border)')}
                  />
                </div>
                {err && <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{err}</p>}
                <button type="submit" className="btn-teal" disabled={status === 'loading'} style={{ justifyContent: 'center' }}>
                  {status === 'loading' ? 'Enviando...' : <><Send size={16} /> Enviar mensaje</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
