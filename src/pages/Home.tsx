import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, CheckCircle, ChevronDown, Code2, TrendingUp, Share2, BookOpen, Star, Zap, Shield, HeartHandshake, Users, Lightbulb, Wrench, Rocket } from 'lucide-react'
import { CTASection } from '../components/CTASection'
import { SEOHead } from '../components/SEOHead'

// ──────────── HERO ────────────
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const load = () => { v.src = '/video/hero.mp4'; v.load() }
    if (document.readyState === 'complete') load()
    else window.addEventListener('load', load, { once: true })
  }, [])

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      {/* Video bg */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      {/* Gradient overlay — contenido a la izquierda, video protagonista a la derecha */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, transparent 75%)', zIndex: 1 }} />
      {/* Fallback si no hay video */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)', zIndex: -1 }} />

      {/* Content — anclado a la izquierda */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '0 24px 0 0', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 420 }}
        >
          <span style={{ display: 'inline-block', background: 'rgba(0,188,212,0.2)', border: '1px solid rgba(0,188,212,0.4)', color: '#00BCD4', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 11px', borderRadius: 20, marginBottom: 14 }}>
            Agencia de Marketing Digital
          </span>
          <h1 style={{ fontSize: 'clamp(24px, 3.2vw, 42px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', marginBottom: 14 }}>
            Diseño web y marketing digital que{' '}
            <span style={{ color: '#00BCD4' }}>genera resultados</span>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: 22, maxWidth: 360 }}>
            Creamos páginas web de alto rendimiento, gestionamos tu presencia digital y diseñamos estrategias que convierten visitas en clientes.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/agendar-cita" className="btn-teal" style={{ fontSize: 13, padding: '10px 22px' }}>
              Agendar cita gratis <ArrowRight size={14} />
            </Link>
            <Link to="/servicios" className="btn-outline-white" style={{ fontSize: 13, padding: '10px 22px' }}>
              Ver servicios
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 22, flexWrap: 'wrap' }}>
            {['Resultados reales', 'Precios accesibles', 'Soporte personalizado'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                <CheckCircle size={12} style={{ color: '#00BCD4', flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Descubrir</span>
        <ChevronDown size={20} style={{ color: 'rgba(255,255,255,0.5)', animation: 'tcBounce 1.8s ease-in-out infinite' }} />
      </div>
    </section>
  )
}

// ──────────── SERVICES PREVIEW ────────────
const SERVICES = [
  { icon: <Code2 size={22} />, title: 'Diseño y Desarrollo Web', desc: 'Sitios web profesionales que convierten visitas en clientes. Landing pages, e-commerce y más.', link: '/servicios' },
  { icon: <TrendingUp size={22} />, title: 'Marketing Digital', desc: 'Estrategias integrales con SEO, Meta Ads y campañas que generan resultados medibles.', link: '/servicios' },
  { icon: <Share2 size={22} />, title: 'Community Management', desc: 'Gestión profesional de tus redes sociales con contenido que conecta con tu audiencia.', link: '/servicios' },
  { icon: <BookOpen size={22} />, title: 'Catálogos Digitales', desc: 'Catálogos inteligentes para WhatsApp que hacen más fácil la venta de tus productos.', link: '/servicios' },
]

function ServicesPreview() {
  return (
    <section style={{ padding: '80px 24px', background: 'var(--tc-bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-eyebrow">Lo que hacemos</p>
          <h2 className="section-title" style={{ marginTop: 8 }}>Servicios diseñados para hacer crecer tu negocio</h2>
          <p className="section-subtitle" style={{ marginTop: 12, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Desde la estrategia hasta la ejecución, cubrimos todos los aspectos de tu presencia digital.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {SERVICES.map(s => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="service-card"
            >
              <div className="service-icon-wrap">{s.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--tc-text)' }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--tc-muted)', lineHeight: 1.65 }}>{s.desc}</p>
              <Link to={s.link} style={{ fontSize: 13, color: 'var(--tc-primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
                Saber más <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/servicios" className="btn-teal">Ver todos los servicios <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  )
}

// ──────────── WHY US ────────────
const WHY = [
  { icon: <Zap size={22} />, title: 'Entregas rápidas', desc: 'Cumplimos los plazos acordados sin sacrificar calidad.' },
  { icon: <Star size={22} />, title: 'Calidad premium', desc: 'Cada proyecto se trabaja con los más altos estándares de diseño y código.' },
  { icon: <Shield size={22} />, title: 'Resultados garantizados', desc: 'Trabajamos hasta que estés 100% satisfecho con el resultado.' },
  { icon: <HeartHandshake size={22} />, title: 'Soporte personalizado', desc: 'Atención directa con el equipo, sin intermediarios ni bots.' },
]

function WhyUs() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <p className="section-eyebrow">¿Por qué elegirnos?</p>
          <h2 className="section-title" style={{ marginTop: 8, marginBottom: 16 }}>Tu éxito digital es nuestra prioridad</h2>
          <p className="section-subtitle" style={{ marginBottom: 32 }}>
            Somos un equipo joven con experiencia probada en el mercado chileno y latinoamericano. Nos comprometemos con cada cliente como si fuera el único.
          </p>
          <Link to="/por-que-nosotros" className="btn-teal">
            Conocer más <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="feature-card"
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--tc-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tc-primary)' }}>{w.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--tc-text)' }}>{w.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--tc-muted)', lineHeight: 1.6 }}>{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────── STATS ────────────
const STATS = [
  { value: '50+', label: 'Proyectos completados' },
  { value: '98%', label: 'Clientes satisfechos' },
  { value: '3', label: 'Países atendidos' },
  { value: '24h', label: 'Tiempo de respuesta' },
]

function Stats() {
  return (
    <section style={{ padding: '60px 24px', background: 'var(--tc-primary)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ──────────── PROCESS PREVIEW ────────────
const STEPS = [
  {
    icon: <Users size={22} />,
    title: 'Briefing',
    desc: 'Nos reunimos para entender tu negocio, objetivos y público objetivo.',
    bullets: ['Llamada o videollamada inicial', 'Análisis de tu negocio', 'Definición del alcance'],
  },
  {
    icon: <Lightbulb size={22} />,
    title: 'Estrategia',
    desc: 'Diseñamos la solución más efectiva y te presentamos una propuesta clara.',
    bullets: ['Propuesta de solución a medida', 'Presupuesto sin compromiso', 'Planificación del proyecto'],
  },
  {
    icon: <Wrench size={22} />,
    title: 'Ejecución',
    desc: 'Desarrollamos tu sitio con calidad premium y te mostramos avances.',
    bullets: ['Desarrollo con calidad premium', 'Link de prueba para revisión', 'Ajustes según tus comentarios'],
  },
  {
    icon: <Rocket size={22} />,
    title: 'Entrega',
    desc: 'Publicamos tu sitio, lo conectamos a tu dominio y te damos soporte.',
    bullets: ['Publicación en tu hosting', 'Conexión a tu dominio', 'Soporte post-entrega'],
  },
]

function ProcessPreview() {
  return (
    <section style={{ padding: '80px 24px', background: 'var(--tc-bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-eyebrow">Cómo trabajamos</p>
          <h2 className="section-title" style={{ marginTop: 8 }}>Un proceso claro y transparente</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              style={{
                background: '#fff',
                border: '1px solid #E8EDF5',
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}
            >
              {/* Ícono */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(11,190,200,0.15), rgba(12,196,160,0.15))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tc-primary)',
              }}>
                {s.icon}
              </div>

              {/* Título */}
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--tc-text)', margin: 0 }}>{s.title}</h3>

              {/* Descripción */}
              <p style={{ fontSize: 13.5, color: 'var(--tc-muted)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>

              {/* Bullets */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {s.bullets.map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--tc-primary-dark)', fontWeight: 500 }}>
                    <ArrowRight size={14} style={{ color: 'var(--tc-primary)', flexShrink: 0 }} />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Botón */}
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <Link
                  to="/proceso"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px 16px',
                    border: '1.5px solid var(--tc-primary)',
                    borderRadius: 10,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: 'var(--tc-primary)',
                    textDecoration: 'none',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--tc-primary)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--tc-primary)' }}
                >
                  Más información
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────── FAQ ────────────
const FAQS = [
  { q: '¿Cómo es el proceso de trabajo?', a: 'Comenzamos con una llamada o videollamada para entender tu negocio y objetivos. Luego envías los textos e imágenes necesarios. Desarrollamos el sitio y te lo mostramos en un link de prueba (no público). Revisamos juntos en una videollamada y realizamos ajustes. Finalmente, publicamos tu sitio en tu hosting y lo conectamos a tu dominio.' },
  { q: '¿Cuánto demora el desarrollo de un sitio web?', a: '• Landing Básica: 3–5 días\n• Landing Page Premium: 5–7 días\n• Sitio web Corporativo: 7–10 días\n• Menú Digital Básico: 5–7 días\n• Menú Digital Premium: 10–15 días\n• Sistema de Citas Online: 10–15 días\n• E-commerce Básico: 10–15 días\n• E-commerce Completo: 20–30 días' },
  { q: '¿El hosting y dominio están incluidos?', a: 'Te asesoramos en la compra y configuración, de esta manera garantizamos que tanto el proyecto, hosting y dominio quedan a tu nombre, por lo tanto son de tu plena propiedad y control.' },
  { q: '¿Mi sitio web se verá bien en el celular?', a: 'Sí, todos los sitios están diseñados para funcionar correctamente en celulares, tablets y computadores.' },
  { q: '¿Mi sitio web aparecerá en Google?', a: 'El sitio se entrega con SEO básico para facilitar su indexación en Google. Para posicionar en los primeros resultados, se recomienda una estrategia SEO o campañas de publicidad.' },
  { q: '¿Me ayudan después de publicar mi sitio web?', a: 'Sí, puedes contar con soporte para resolver dudas o realizar mejoras.' },
  { q: '¿Cuánto cuesta un sitio web?', a: 'El costo varía según el tipo de proyecto, necesidades para tu negocio o requerimientos. Los precios parten de los $150.000 CLP. Agenda una cita totalmente gratis y te damos una cotización sin compromiso.' },
  { q: '¿Puedo ver ejemplos de sus trabajos anteriores?', a: 'Sí, visita nuestro catálogo en technecreativ.com o solicítanos el portafolio por WhatsApp para ver proyectos similares al tuyo.' },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-eyebrow">FAQ</p>
          <h2 className="section-title" style={{ marginTop: 8 }}>Preguntas frecuentes</h2>
        </div>
        <div>
          {FAQS.map((f, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                <span>{f.q}</span>
                <ChevronDown size={18} style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, color: 'var(--tc-primary)' }} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="faq-answer" style={{ whiteSpace: 'pre-line' }}>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Home() {
  return (
    <main>
      <SEOHead
        title="Agencia de Marketing Digital y Diseño Web"
        description="Diseño web, marketing digital y publicidad para negocios en Chile y Venezuela. Landing pages, e-commerce y más. Cotiza gratis hoy."
        path="/"
      />
      <Hero />
      <ServicesPreview />
      <WhyUs />
      <Stats />
      <ProcessPreview />
      <FAQ />
      <CTASection />
    </main>
  )
}
