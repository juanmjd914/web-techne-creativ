import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'motion/react'
import { TrendingUp, Share2, BookOpen, Palette, Megaphone, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { CTASection } from '../components/CTASection'
import { SEOHead } from '../components/SEOHead'

const SERVICES = [
  {
    icon: <Sparkles size={24} />,
    title: 'Catálogos Digitales',
    desc: 'Catálogos web interactivos con descripciones y contenido personalizado adaptado a tu marca.',
    features: ['Contenido redactado a tus necesidades y revisado por expertos', 'Diseño web interactivo con filtros por categoría', 'Fotografías de productos con edición básica', 'Integración de botón de pedido por WhatsApp', 'Actualización semestral del contenido'],
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
    features: ['Calendario editorial mensual', 'Diseño de publicaciones', 'Publicación en 2-3 redes sociales', 'Respuesta a comentarios y mensajes', 'Reporte mensual de resultados'],
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
    features: ['Diseño personalizado con tu marca', 'Formato PDF o link web interactivo', 'Hasta 50 productos con foto y precio', 'Botón directo a WhatsApp para pedir', 'Actualización trimestral'],
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
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 3–5 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: false,
  },
  {
    name: 'Landing Page Premium',
    price: '$300.000',
    period: '',
    desc: 'Landing con animaciones, diseño cinematográfico y alto impacto visual.',
    features: [
      'Video cinematográfico de fondo y alto impacto visual',
      'Diseño personalizado',
      'Diseño premium con animaciones',
      'Efectos scroll reveal',
      '15 fotos de productos / servicios',
      'Botones de redes sociales',
      'Botón WhatsApp flotante',
      'SEO básico',
      '100% responsive (móvil y escritorio)',
      'Optimizado para velocidad',
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 5–7 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: false,
  },
  {
    name: 'Sitio Web Corporativo',
    price: '$450.000',
    period: '',
    desc: 'Sitio web completo de varias secciones para empresas y negocios.',
    features: [
      'Diseño premium personalizado',
      'Video cinematográfico / imagen de alto impacto',
      'Múltiples páginas (Inicio, Servicios, Nosotros, Contacto)',
      'Formularios de contacto y cotización',
      'Botones de redes sociales',
      'Botón WhatsApp flotante',
      'SEO básico',
      '100% responsive (móvil y escritorio)',
      'Optimizado para velocidad',
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 7–10 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: false,
  },
  {
    name: 'Menú Digital Básico',
    price: '$160.000',
    period: '',
    desc: 'Menú interactivo para que tus clientes pidan directo por WhatsApp.',
    features: [
      'Menú con categorías y filtros',
      'Diseño personalizado',
      '30 productos con fotos, descripción y precios',
      'Botón WhatsApp flotante para pedidos',
      'Botones de redes sociales',
      '100% responsive (móvil y escritorio)',
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 5–7 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: false,
  },
  {
    name: 'Menú Digital Premium',
    price: '$400.000',
    period: '',
    desc: 'Menú interactivo con QR, panel admin y opción de IA para generar descripciones.',
    features: [
      'Menú con categorías y filtros',
      '30 productos con fotos, descripción y precios',
      'Diseño premium personalizado',
      'Panel admin para editar productos',
      'Código QR incluido',
      'Integración con WhatsApp para pedidos',
      'Opcional: IA para descripciones de productos y ofertas',
      'Botones de redes sociales',
      '100% responsive (móvil y escritorio)',
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 10–15 días',
    ],
    highlight: true,
    cta: 'El más elegido',
    desde: false,
  },
  {
    name: 'Sistema de Citas Online',
    price: '$700.000',
    period: '',
    desc: 'Sitio web con agenda online integrada, gestión de citas y notificaciones por correo.',
    features: [
      'Diseño premium personalizado',
      'Video cinematográfico / imagen de alto impacto',
      'Múltiples páginas (Inicio, Servicios, Nosotros, Contacto)',
      'Formulario de reserva de citas',
      'Panel admin con calendario',
      'Notificaciones por correo',
      'Gestión de horarios y disponibilidad',
      'Formularios de contacto y cotización',
      'Botones de redes sociales',
      'Botón WhatsApp flotante',
      'SEO básico',
      '100% responsive (móvil y escritorio)',
      'Optimizado para velocidad',
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 10–15 días',
    ],
    highlight: false,
    cta: 'Cotizar',
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
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 10–15 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: true,
  },
  {
    name: 'E-commerce Completo',
    price: '$800.000',
    period: '',
    desc: 'Tienda online full-stack con pagos reales, autenticación, panel admin y correos automáticos.',
    features: [
      'Diseño premium personalizado',
      'Video cinematográfico / imagen de alto impacto',
      'Múltiples páginas (Inicio, Tienda, Nosotros, Cuenta, Soporte)',
      'Panel admin: productos, pedidos, stock y ventas',
      'Catálogo con filtros por categoría',
      'Integración con pasarelas de pago',
      '20 productos con fotos, descripción y precios',
      'Registro e inicio de sesión de administrador',
      'Registro e inicio de sesión para clientes',
      'Carrito de compras',
      'Múltiples métodos de pago (efectivo o transferencias)',
      'Formularios de suscripción',
      'Checkout por WhatsApp',
      'Botones de redes sociales',
      'Botón WhatsApp flotante',
      'SEO básico',
      '100% responsive (móvil y escritorio)',
      'Optimizado para velocidad',
      'Hosting y dominio gratis por 1 año',
      'Correo corporativo incluido',
      'Entrega en 20–30 días',
    ],
    highlight: false,
    cta: 'Cotizar',
    desde: true,
  },
]

// Datos estructurados generados desde PACKAGES: precios y contenidos no se pueden desincronizar
const OFFER_CATALOG_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Diseño y desarrollo web',
  provider: {
    '@type': 'Organization',
    name: 'Techne Creativ',
    url: 'https://technecreativ.com',
  },
  areaServed: { '@type': 'Country', name: 'Chile' },
  url: 'https://technecreativ.com/servicios',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Paquetes de diseño y desarrollo web',
    itemListElement: PACKAGES.map(p => ({
      '@type': 'Offer',
      name: p.name,
      description: `${p.desc} Incluye: ${p.features.join('; ')}.`,
      price: p.price.replace(/[$.]/g, ''),
      priceCurrency: 'CLP',
      availability: 'https://schema.org/InStock',
      url: 'https://technecreativ.com/agendar-cita',
      itemOffered: {
        '@type': 'Service',
        name: p.name,
        description: p.desc,
        serviceType: 'Diseño y desarrollo web',
        provider: { '@type': 'Organization', name: 'Techne Creativ' },
        areaServed: { '@type': 'Country', name: 'Chile' },
      },
    })),
  },
}

const BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://technecreativ.com/' },
    { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://technecreativ.com/servicios' },
  ],
}

export function Servicios() {
  return (
    <main style={{ paddingTop: 68 }}>
      <SEOHead path="/servicios" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(OFFER_CATALOG_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_LD)}</script>
      </Helmet>
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
                  <Link to="/agendar-cita" style={{ fontSize: 13, color: 'var(--tc-primary-dark)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
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
                className={p.highlight ? 'pkg-highlighted' : undefined}
                style={{
                  background: p.highlight ? 'linear-gradient(135deg, var(--tc-primary-dark), var(--tc-primary-darker))' : '#fff',
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
                {p.highlight && <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>Más popular</span>}
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: p.highlight ? '#fff' : 'var(--tc-text)', marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: p.highlight ? 'rgba(255,255,255,0.9)' : 'var(--tc-muted)' }}>{p.desc}</p>
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
                  {p.desde && <span style={{ fontSize: 12, fontWeight: 600, color: p.highlight ? 'rgba(255,255,255,0.85)' : 'var(--tc-muted)', display: 'block', marginBottom: 2 }}>Desde</span>}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 16 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: p.highlight ? '#fff' : 'var(--tc-text)', lineHeight: 1 }}>{p.price}</span>
                    <span style={{ fontSize: 14, color: p.highlight ? 'rgba(255,255,255,0.85)' : 'var(--tc-muted)', paddingBottom: 4 }}>CLP</span>
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
            ¿Necesitas algo personalizado? <Link to="/contacto" style={{ color: 'var(--tc-primary-dark)', fontWeight: 600, textDecoration: 'none' }}>Cuéntanos tu proyecto</Link>
          </p>
        </div>
      </section>

      {/* Plan Techne Flexible */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <p className="section-eyebrow">Plan Techne Flexible</p>
            <h2 className="section-title" style={{ marginTop: 8 }}>Tu proyecto puede empezar hoy</h2>
            <p className="section-subtitle" style={{ marginTop: 14, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              Sabemos que invertir en tu presencia digital de una sola vez no siempre es posible. Por eso existe el
              Plan Techne Flexible: divides el pago en tres partes, sin intereses ni recargos, y tu sitio sale publicado
              antes de que termines de pagarlo.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              background: '#fff',
              border: '1px solid var(--tc-border)',
              borderRadius: 20,
              padding: 36,
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--tc-text)', margin: 0 }}>Veámoslo con un ejemplo real</h3>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--tc-primary-dark)', background: '#E0F7FA', padding: '5px 12px', borderRadius: 999,
              }}>
                E-commerce Básico · desde $600.000
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--tc-muted)', marginBottom: 26 }}>
              Digamos que eliges una tienda online básica. Así quedaría tu pago, paso a paso:
            </p>

            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { n: '1', t: 'Pagas $300.000 para empezar (50%)', d: 'Con ese primer pago arrancamos de inmediato: diseño, desarrollo, carga de tus productos, todo.' },
                { n: '2', t: 'Publicamos tu tienda', d: 'Cuando está lista, sale online. Ya puedes venderle a tus clientes mientras terminas de pagarla.' },
                { n: '3', t: 'Pagas $150.000 a los 30 días (25%)', d: 'Sin intereses, sin recargos, sin sorpresas. El monto es exactamente ese.' },
                { n: '4', t: 'Pagas $150.000 a los 60 días (25%)', d: 'Al completar el 100% recibes las credenciales de tu dominio y hosting. Son tuyas, a tu nombre.' },
              ].map(step => (
                <li key={step.n} style={{ display: 'grid', gridTemplateColumns: '38px 1fr', gap: 16, alignItems: 'start' }}>
                  <span style={{
                    width: 38, height: 38, borderRadius: '50%', background: 'var(--tc-primary-dark)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15,
                  }}>
                    {step.n}
                  </span>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--tc-text)', margin: '0 0 3px' }}>{step.t}</h4>
                    <p style={{ fontSize: 14, color: 'var(--tc-muted)', margin: 0, lineHeight: 1.5 }}>{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p style={{
              marginTop: 26, paddingTop: 18, borderTop: '1px solid var(--tc-border)',
              fontSize: 13, color: 'var(--tc-muted)', fontStyle: 'italic', lineHeight: 1.55,
            }}>
              El Plan Techne Flexible aplica sobre el precio regular del paquete que elijas.
            </p>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <Link to="/#demo-gratis" className="btn-teal">
              Solicitar mi demo gratis <ArrowRight size={16} />
            </Link>
          </div>
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
