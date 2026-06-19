import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Search, Lightbulb, Code2, Rocket, HeartHandshake, ArrowRight } from 'lucide-react'
import { CTASection } from '../components/CTASection'
import { SEOHead } from '../components/SEOHead'

const STEPS = [
  {
    n: '01',
    icon: <Search size={22} />,
    title: 'Briefing y análisis',
    desc: 'Todo empieza por entenderte a ti y a tu negocio. En una reunión inicial virtual (por Google Meet) escuchamos tus metas, analizamos tu situación actual y estudiamos tu mercado y competencia.',
    duration: '1-2 días',
    items: [
      'Reunión de diagnóstico (30-60 min)',
      'Análisis de competencia digital',
      'Definición de objetivos y KPIs',
      'Propuesta y presupuesto detallados',
    ],
  },
  {
    n: '02',
    icon: <Lightbulb size={22} />,
    title: 'Estrategia y diseño',
    desc: 'Con el análisis en mano, diseñamos la estrategia y los primeros bocetos visuales. Aquí definimos la estructura, paleta de colores, tipografías y el flujo de usuario.',
    duration: '2-5 días',
    items: [
      'Mapa de sitio y wireframes',
      'Propuesta visual y paleta de marca',
      'Contenido y copy inicial',
      'Aprobación antes de desarrollar',
    ],
  },
  {
    n: '03',
    icon: <Code2 size={22} />,
    title: 'Desarrollo y producción',
    desc: 'Convertimos el diseño aprobado en un producto real. Desarrollamos tu sitio web o campaña con las mejores prácticas técnicas, asegurándonos de que sea rápido, seguro y funcional.',
    duration: '5-15 días',
    items: [
      'Desarrollo frontend y backend (si aplica)',
      'Integración de funcionalidades (formularios, pagos, etc.)',
      'Optimización de velocidad y SEO',
      'Pruebas en múltiples dispositivos',
    ],
  },
  {
    n: '04',
    icon: <HeartHandshake size={22} />,
    title: 'Revisión y ajustes',
    desc: 'Te presentamos el resultado y trabajamos juntos en los ajustes necesarios. Tienes hasta 2 rondas de revisión incluidas para que todo quede exactamente como lo imaginaste.',
    duration: '2-3 días',
    items: [
      'Presentación del resultado al cliente',
      'Hasta 2 rondas de ajustes sin costo extra',
      'Pruebas finales de funcionamiento',
      'Aprobación final del cliente',
    ],
  },
  {
    n: '05',
    icon: <Rocket size={22} />,
    title: 'Lanzamiento y entrega',
    desc: 'Publicamos tu proyecto y te entregamos todo lo que necesitas para gestionarlo. Te enseñamos a usar las herramientas y te dejamos con el soporte post-lanzamiento.',
    duration: '1 día',
    items: [
      'Deploy en producción',
      'Capacitación de uso (si aplica)',
      'Entrega de accesos y archivos fuente',
      'Soporte post-lanzamiento incluido (15 días)',
    ],
  },
]

const TIMELINES = [
  { type: 'Landing page', time: '3-7 días hábiles' },
  { type: 'Sitio corporativo', time: '7-10 días hábiles' },
  { type: 'E-commerce', time: '10-30 días hábiles' },
  { type: 'Campaña digital', time: '3-5 días hábiles' },
  { type: 'Catálogo digital', time: '5-15 días hábiles' },
  { type: 'Branding completo', time: '7-12 días hábiles' },
]

export function Proceso() {
  return (
    <main style={{ paddingTop: 68 }}>
      <SEOHead
        title="Nuestro Proceso de Trabajo"
        description="Conoce cómo trabajamos en Techne Creativ: desde el briefing inicial hasta la entrega y soporte. Un proceso claro, transparente y orientado a resultados."
        path="/proceso"
      />
      {/* Hero */}
      <section style={{ padding: '72px 24px 60px', background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FA 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p className="section-eyebrow">Proceso</p>
          <h1 className="section-title" style={{ marginTop: 12 }}>Así trabajamos contigo, paso a paso</h1>
          <p className="section-subtitle" style={{ marginTop: 16, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Transparencia total en cada etapa. Sabrás exactamente en qué estamos trabajando y cuándo esperar resultados.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'flex-start' }}
            >
              {/* Number + line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div className="step-badge">{s.n}</div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, flexGrow: 1, background: 'linear-gradient(to bottom, var(--tc-primary), transparent)', minHeight: 60, marginTop: 8 }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--tc-primary)' }}>
                    {s.icon}
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--tc-text)' }}>{s.title}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tc-primary)', background: 'var(--tc-primary-light)', padding: '3px 10px', borderRadius: 12 }}>{s.duration}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--tc-muted)', lineHeight: 1.75, marginBottom: 16 }}>{s.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--tc-text)' }}>
                      <span style={{ color: 'var(--tc-primary)', fontWeight: 700, flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timelines */}
      <section style={{ padding: '80px 24px', background: 'var(--tc-bg)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-eyebrow">Tiempos de entrega</p>
            <h2 className="section-title" style={{ marginTop: 8 }}>¿Cuánto tardará mi proyecto?</h2>
            <p className="section-subtitle" style={{ marginTop: 12, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              Los tiempos estimados consideran el flujo estándar de aprobaciones. Con feedback rápido de tu parte, podemos entregar antes.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TIMELINES.map((t, i) => (
              <motion.div
                key={t.type}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                style={{ background: '#fff', border: '1px solid var(--tc-border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--tc-text)' }}>{t.type}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tc-primary)', whiteSpace: 'nowrap' }}>{t.time}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://catalogo-techne-creativ.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-teal">Ver portafolio <ArrowRight size={16} /></a>
            <Link to="/agendar-cita" className="btn-outline">Empezar mi proyecto</Link>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
