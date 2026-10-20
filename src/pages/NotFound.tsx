import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight } from 'lucide-react'

// El servidor ya responde 404 para estas URLs (ver server/index.ts); esta
// pagina es solo lo que ve la persona. noindex por si algun bot la ejecuta.
export function NotFound() {
  return (
    <main>
      <Helmet>
        <title>Página no encontrada — Techne Creativ</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <section style={{ padding: '160px 24px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p className="section-eyebrow">Error 404</p>
          <h1 className="section-title" style={{ marginTop: 8, marginBottom: 16 }}>Esta página no existe</h1>
          <p className="section-subtitle" style={{ marginBottom: 32 }}>
            Puede que el enlace esté mal escrito o que la página se haya movido.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn-teal">Volver al inicio <ArrowRight size={16} /></Link>
            <Link to="/servicios" className="btn-outline">Ver servicios</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
