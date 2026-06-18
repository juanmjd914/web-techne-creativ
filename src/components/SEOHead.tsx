import { Helmet } from 'react-helmet-async'

const SITE = 'Techne Creativ'
const DOMAIN = 'https://technecreativ.com'
const OG_IMAGE = `${DOMAIN}/og-image.webp`

interface SEOHeadProps {
  title: string
  description: string
  path?: string
  ogImage?: string
}

export function SEOHead({ title, description, path = '', ogImage = OG_IMAGE }: SEOHeadProps) {
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
