import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Zap, Star, Shield, HeartHandshake, Clock, TrendingUp, Users, Award, ArrowRight } from 'lucide-react'
import { CTASection } from '../components/CTASection'
import { SEOHead } from '../components/SEOHead'

const REASONS = [
  {
    icon: <Zap size={24} />,
    title: 'Entregas puntuales',
    desc: 'Cumplimos los plazos acordados. Siempre. Nuestro proceso está diseñado para entregar a tiempo sin sacrificar calidad.',
  },
  {
    icon: <Star size={24} />,
    title: 'Diseño de alta calidad',
    desc: 'Cada proyecto pasa por revisión de diseño y usabilidad. No entregamos nada que no llevaríamos orgullosos en nuestro portafolio.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Satisfacción garantizada',
    desc: 'Hacemos ajustes hasta que estés 100% satisfecho. No cerramos el proyecto hasta que el resultado sea exactamente lo que buscabas.',
  },
  {
    icon: <HeartHandshake size={24} />,
    title: 'Trato personalizado',
    desc: 'Trabajas directamente con el equipo, no con un intermediario. Conocemos tu proyecto a fondo y nos comprometemos con tus metas.',
  },
  {
    icon: <Clock size={24} />,
    title: 'Disponibilidad real',
    desc: 'Respondemos en menos de 24 horas. Para asuntos urgentes, en el mismo día. Sin bots, sin formularios, solo personas reales.',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Enfoque en resultados',
    desc: 'No hacemos páginas "bonitas" sin propósito. Cada decisión de diseño y estrategia está orientada a generar resultados medibles.',
  },
]

const VALUES = [
  { icon: <Users size={20} />, label: 'Trabajo en equipo' },
  { icon: <Star size={20} />, label: 'Excelencia' },
  { icon: <HeartHandshake size={20} />, label: 'Compromiso' },
  { icon: <Award size={20} />, label: 'Innovación' },
]

const STATS = [
  { value: '50+', label: 'Proyectos completados' },
  { value: '3', label: 'Países atendidos' },
  { value: '2', label: 'Años de experiencia' },
  { value: '100%', label: 'Clientes que recomiendan' },
]

export function PorQueNosotros() {
  return (
    <main style={{ paddingTop: 68 }}>
      <SEOHead
        title="¿Por qué Techne Creativ? Tu aliado digital"
        description="Somos tu aliado digital en Chile y Venezuela. Trabajamos contigo para que tu negocio tenga presencia digital real que atrae clientes."
        path="/por-que-nosotros"
      />
      {/* Hero */}
      <section style={{ padding: '72px 24px 60px', background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FA 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p className="section-eyebrow">¿Por qué nosotros?</p>
          <h1 className="section-title" style={{ marginTop: 12 }}>No somos solo una agencia de marketing y desarrollo web</h1>
          <p className="section-subtitle" style={{ marginTop: 16, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Somos tu aliado digital. Trabajamos contigo para que tu negocio tenga presencia digital.
          </p>
        </div>
      </section>

      {/* Reasons */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-eyebrow">Razones para elegirnos</p>
            <h2 className="section-title" style={{ marginTop: 8 }}>Lo que nos diferencia</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {REASONS.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
                style={{ background: 'var(--tc-bg)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--tc-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-primary)' }}>
                  {r.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--tc-text)' }}>{r.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--tc-muted)', lineHeight: 1.7 }}>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '64px 24px', background: 'var(--tc-primary)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About section */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div className="responsive-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <p className="section-eyebrow">Quiénes somos</p>
            <h2 className="section-title" style={{ marginTop: 12, marginBottom: 20 }}>Una agencia con alma de startup y experiencia de empresa</h2>
            <p style={{ fontSize: 15, color: 'var(--tc-muted)', lineHeight: 1.8, marginBottom: 16 }}>
              Techne Creativ nació con la misión de democratizar el acceso a servicios digitales de alta calidad para negocios locales. Creemos que una pyme merece la misma calidad digital que una gran empresa.
            </p>
            <p style={{ fontSize: 15, color: 'var(--tc-muted)', lineHeight: 1.8, marginBottom: 28 }}>
              Nuestro equipo combina diseño, tecnología y marketing en un solo lugar. Con sede en Rancagua, Chile y Barquisimeto, Venezuela, atendemos clientes de toda Latinoamérica.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {VALUES.map(v => (
                <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--tc-primary-light)', color: 'var(--tc-primary-dark)', padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  {v.icon} {v.label}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/agendar-cita" className="btn-teal">Agendar cita gratis <ArrowRight size={16} /></Link>
              <Link to="/proceso" className="btn-outline">Ver proceso de trabajo</Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Chile', sub: 'Rancagua, O\'Higgins', bg: '#E0F7FA' },
              { label: 'Venezuela', sub: 'Barquisimeto, Lara', bg: '#F0FDFE' },
              { label: 'Respuesta', sub: 'En menos de 24 horas', bg: '#F0FDFE' },
              { label: 'Garantía', sub: 'Satisfacción total', bg: '#E0F7FA' },
            ].map(c => (
              <div key={c.label} style={{ background: c.bg, borderRadius: 16, padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--tc-text)' }}>{c.label}</span>
                <span style={{ fontSize: 12, color: 'var(--tc-muted)' }}>{c.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
