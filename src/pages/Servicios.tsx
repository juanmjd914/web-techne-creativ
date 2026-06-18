import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Code2, TrendingUp, Share2, BookOpen, Palette, ShoppingCart, Megaphone, ArrowRight, CheckCircle, Layout, Sparkles } from 'lucide-react'
import { CTASection } from '../components/CTASection'
import { SEOHead } from '../components/SEOHead'

const SERVICES = [
  {
    icon: <Code2 size={24} />,
    title: 'Páginas Web Corporativas',
    desc: 'Sitios web profesionales que representan tu marca y generan confianza en tus clientes.',
    features: ['Diseño responsive adaptado a tu marca', 'Optimización SEO desde el inicio', 'Velocidad y rendimiento optimizados', 'Formulario de contacto integrado', 'Panel de administración (si aplica)'],
    from: 'Desde $250.000 CLP',
  },
  {
    icon: <ShoppingCart size={24} />,
    title: 'Tiendas Online / E-commerce',
    desc: 'Plataformas de venta online completas con carrito, pagos seguros y gestión de inventario.',
    features: ['Catálogo de hasta 20 productos iniciales', 'Integración con pasarelas de pago', 'Panel de administración de pedidos', 'Sistema de cupones y descuentos', 'Notificaciones automáticas al cliente'],
    from: 'Desde $500.000 CLP',
  },
  {
    icon: <Layout size={24} />,
    title: 'Landing Pages',
    desc: 'Páginas de aterrizaje de una sola pantalla, diseñadas para captar clientes y generar ventas rápidamente.',
    features: ['Diseño atractivo orientado a conversión', 'Sección hero con llamada a la acción', 'Formulario de contacto o WhatsApp directo', 'Optimización SEO básica incluida', 'Entrega en 5 días hábiles'],
    from: 'Desde $120.000 CLP',
  },
  {
    icon: <Sparkles size={24} />,
    title: 'Catálogos Digitales con IA',
    desc: 'Catálogos web interactivos con descripciones y contenido generado con inteligencia artificial adaptado a tu marca.',
    features: ['Contenido redactado con IA y revisado por expertos', 'Diseño web interactivo con filtros por categoría', 'Fotografías de productos con edición básica', 'Integración de botón de pedido por WhatsApp', 'Actualización semestral del contenido incluida'],
    from: 'Desde $180.000 CLP',
  },
  {
    icon: <Palette size={24} />,
    title: 'Branding e Identidad Visual',
    desc: 'Creamos la identidad visual de tu marca: logo, paleta de colores, tipografías y manual de marca.',
    features: ['Diseño de logotipo en alta resolución', 'Paleta de colores corporativos', 'Tipografías y sistema visual', 'Manual de marca básico', 'Archivos en todos los formatos'],
    from: 'Desde $150.000 CLP',
  },
  {
    icon: <Share2 size={24} />,
    title: 'Community Management',
    desc: 'Gestión profesional de tus redes sociales con contenido estratégico y diseño de calidad.',
    features: ['Calendario editorial mensual', 'Diseño de publicaciones en Canva', 'Publicación en 2-3 redes sociales', 'Respuesta a comentarios y mensajes', 'Reporte mensual de resultados'],
    from: 'Desde $120.000 CLP/mes',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Campañas de Publicidad Digital',
    desc: 'Campañas efectivas en Meta Ads (Facebook e Instagram) orientadas a resultados reales.',
    features: ['Estrategia de segmentación de audiencia', 'Creación de los anuncios (copy + imagen/video)', 'Configuración y optimización de la campaña', 'Seguimiento y ajuste continuo', 'Reporte de rendimiento semanal'],
    from: 'Desde $100.000 CLP/mes',
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Catálogos Digitales para WhatsApp',
    desc: 'Catálogos interactivos que tus clientes pueden ver y compartir fácilmente desde WhatsApp.',
    features: ['Diseño personalizado con tu marca', 'Formato PDF o link web interactivo', 'Hasta 50 productos con foto y precio', 'Botón directo a WhatsApp para pedir', 'Actualización trimestral incluida'],
    from: 'Desde $80.000 CLP',
  },
  {
    icon: <Megaphone size={24} />,
    title: 'Marketing Digital Integral',
    desc: 'Estrategia completa de marketing digital: SEO, redes sociales, publicidad y análisis.',
    features: ['Auditoría digital inicial completa', 'Estrategia de contenido y SEO', 'Gestión de redes sociales', 'Campañas de publicidad pagada', 'Reporte mensual detallado con KPIs'],
    from: 'Cotización personalizada',
  },
]

const PACKAGES = [
  {
    name: 'Landing Básica',
    price: '$150.000',
    period: '',
    desc: 'Una página profesional para presentar tu negocio y captar clientes.',
    features: [
      'Diseño personalizado (sección hero con imagen)',
      '10 fotos de productos / servicios',
      'Botones de redes sociales',
      'Botón WhatsApp flotante',
      'SEO básico',
      '100% responsive (móvil y escritorio)',
      'Optimizado para velocidad',
      'Entrega en 3–5 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: false,
  },
  {
    name: 'Menú Digital Premium',
    price: '$400.000',
    period: '',
    desc: 'Menú interactivo con QR, panel admin y opcionalmente IA para generar descripciones.',
    features: [
      'Menú con categorías y filtros',
      '30 productos con fotos, descripción y precios',
      'Diseño premium personalizado',
      'Panel admin para editar productos',
      'Código QR incluido',
      'Integración con WhatsApp para pedidos',
      'Opcional: IA para descripciones de productos',
      'Botones de redes sociales',
      '100% responsive (móvil y escritorio)',
      'Entrega en 10–15 días',
    ],
    highlight: true,
    cta: 'El más elegido',
    desde: false,
  },
  {
    name: 'E-commerce Básico',
    price: '$600.000',
    period: '',
    desc: 'Tienda online con catálogo de productos, carrito y WhatsApp para cerrar ventas.',
    features: [
      'Diseño premium personalizado',
      'Video cinematográfico / imagen de alto impacto',
      'Múltiples páginas (Inicio, Tienda, Nosotros, Soporte)',
      'Catálogo con filtros por categoría',
      '20 productos con fotos, descripción y precios',
      'Carrito de compras',
      'Formularios de suscripción',
      'Checkout por WhatsApp',
      'Botones de redes sociales',
      'Botón WhatsApp flotante',
      'SEO básico',
      '100% responsive (móvil y escritorio)',
      'Optimizado para velocidad',
      'Entrega en 10–15 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: true,
  },
]

export function Servicios() {
  return (
    <main style={{ paddingTop: 68 }}>
      <SEOHead
        title="Servicios — Diseño Web, Marketing y Más"
        description="Landing pages, e-commerce, menús digitales, branding y community management. Proyectos web profesionales desde $150.000 CLP. Cotiza gratis."
        path="/servicios"
      />
      {/* Hero */}
      <section style={{ padding: '72px 24px 60px', background: 'linear-gradient(135deg, #F0FDFF 0%, #E0F7FA 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p className="section-eyebrow">Servicios</p>
          <h1 className="section-title" style={{ marginTop: 12 }}>Soluciones digitales completas para tu negocio</h1>
          <p className="section-subtitle" style={{ marginTop: 16, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Desde tu primera página web hasta campañas de marketing digital. Cubrimos todos los frentes de tu presencia online.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://catalogo-techne-creativ.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-teal">Ver portafolio <ArrowRight size={16} /></a>
            <Link to="/agendar-cita" className="btn-outline">Agendar cita gratis</Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-eyebrow">Qué ofrecemos</p>
            <h2 className="section-title" style={{ marginTop: 8 }}>Nuestros servicios</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
                className="service-card"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div className="service-icon-wrap">{s.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--tc-text)', marginBottom: 6 }}>{s.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--tc-muted)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
                <ul className="service-features">
                  {s.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--tc-border)', textAlign: 'right' }}>
                  <Link to="/agendar-cita" style={{ fontSize: 13, color: 'var(--tc-primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Cotizar <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section style={{ padding: '80px 24px', background: 'var(--tc-bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p className="section-eyebrow">Paquetes</p>
            <h2 className="section-title" style={{ marginTop: 8 }}>Proyectos listos para lanzar tu negocio online</h2>
            <p className="section-subtitle" style={{ marginTop: 12, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Desde una landing que capta clientes hasta una tienda completa con carrito y pagos. Elige el proyecto que necesitas y lo entregamos listo para vender.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {PACKAGES.map(p => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45 }}
                style={{
                  background: p.highlight ? 'linear-gradient(135deg, #00BCD4, #0097A7)' : '#fff',
                  border: p.highlight ? 'none' : '1px solid var(--tc-border)',
                  borderRadius: 20,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  boxShadow: p.highlight ? '0 20px 60px rgba(0,188,212,0.25)' : '0 2px 12px rgba(0,0,0,0.05)',
                  transform: p.highlight ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                {p.highlight && <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>Más popular</span>}
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: p.highlight ? '#fff' : 'var(--tc-text)', marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: p.highlight ? 'rgba(255,255,255,0.8)' : 'var(--tc-muted)' }}>{p.desc}</p>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: p.highlight ? 'rgba(255,255,255,0.9)' : 'var(--tc-muted)' }}>
                      <CheckCircle size={15} style={{ color: p.highlight ? 'rgba(255,255,255,0.9)' : 'var(--tc-primary)', flexShrink: 0, marginTop: 1 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: `1px solid ${p.highlight ? 'rgba(255,255,255,0.25)' : 'var(--tc-border)'}`, paddingTop: 20, marginTop: 'auto' }}>
                  {p.desde && <span style={{ fontSize: 12, fontWeight: 600, color: p.highlight ? 'rgba(255,255,255,0.7)' : 'var(--tc-muted)', display: 'block', marginBottom: 2 }}>Desde</span>}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 16 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: p.highlight ? '#fff' : 'var(--tc-text)', lineHeight: 1 }}>{p.price}</span>
                    <span style={{ fontSize: 14, color: p.highlight ? 'rgba(255,255,255,0.7)' : 'var(--tc-muted)', paddingBottom: 4 }}>CLP</span>
                  </div>
                  <Link
                    to="/agendar-cita"
                    className={p.highlight ? 'btn-white' : 'btn-teal'}
                    style={{ justifyContent: 'center' }}
                  >
                    {p.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--tc-muted)' }}>
            ¿Necesitas algo personalizado? <Link to="/contacto" style={{ color: 'var(--tc-primary)', fontWeight: 600, textDecoration: 'none' }}>Cuéntanos tu proyecto</Link>
          </p>
        </div>
      </section>

      <CTASection
        primaryLabel="Ver portafolio"
        primaryHref="https://catalogo-techne-creativ.vercel.app"
        secondaryLabel="Agendar cita gratis"
        secondaryTo="/agendar-cita"
      />
    </main>
  )
}
