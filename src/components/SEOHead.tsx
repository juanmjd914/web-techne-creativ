import { Helmet } from 'react-helmet-async'
import SEO_PAGES from '../lib/seo-pages.json'

const SITE = 'Techne Creativ'
const DOMAIN = 'https://technecreativ.com'
// Logo completo (isotipo + "Téchnē Creativ") sobre blanco, como se pidio
// para WhatsApp/Facebook/Instagram. JPG y no WebP por compatibilidad.
const OG_IMAGE = `${DOMAIN}/og-image.jpg`

export type SEOPath = keyof typeof SEO_PAGES

interface SEOHeadProps {
  // Titulo y descripcion viven en src/lib/seo-pages.json: el servidor lee
  // el mismo archivo para escribir las etiquetas en el HTML cuando el
  // prerender falla (WhatsApp/Facebook no ejecutan JS).
  path: SEOPath
  ogImage?: string
}

export function SEOHead({ path, ogImage = OG_IMAGE }: SEOHeadProps) {
  const { title, description } = SEO_PAGES[path]
  const fullTitle = `${title} — ${SITE}`
  const url = `${DOMAIN}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:locale" content="es_419" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@technecreativ" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
