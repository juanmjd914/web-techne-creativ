import 'dotenv/config'
import express, { type Response } from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { existsSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { contactRouter } from './routes/contact.js'
import { appointmentsRouter } from './routes/appointments.js'
import { adminRouter } from './routes/admin.js'
import { briefRouter } from './routes/brief.js'
import { demoRouter } from './routes/demo.js'
import { loadSeoPages, injectSeo } from './lib/seoMeta.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const app = express()

// Una sola URL por pagina para Google (Search Console 2026-11-09: "Duplicada:
// Google ha elegido una version canonica diferente a la del usuario").
// www.technecreativ.com, /servicios/, /servicios.html, /SERVICIOS e
// /index.html respondian 200 con el mismo contenido. Ahora redirigen 301 a
// https://technecreativ.com/<ruta>. Solo GET/HEAD: un POST redirigido pierde
// el cuerpo. La query (?utm_...) se conserva.
const CANONICAL_HOST = 'technecreativ.com'
// URLs del WordPress anterior que Google sigue citando como referencia.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/services': '/servicios',
  '/nosotros': '/por-que-nosotros',
}
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) return next()
  const host = (req.headers.host || '').toLowerCase()
  const isWww = host === `www.${CANONICAL_HOST}`
  let p = req.path
  if (p === '/index.html') p = '/'
  else if (/^\/[a-z0-9-]+\.html$/i.test(p)) p = p.slice(0, -5)
  if (p.length > 1) p = p.replace(/\/+$/, '')
  if (!path.extname(p)) p = p.toLowerCase()
  p = LEGACY_REDIRECTS[p] ?? p
  if (!isWww && p === req.path) return next()
  const query = req.originalUrl.slice(req.path.length)
  // Siempre absoluta y en nuestro dominio: con una ruta tipo "//otro.com/"
  // un Location relativo "//otro.com" mandaria al visitante a otro sitio.
  p = '/' + p.replace(/^[\/\\]+/, '')
  res.redirect(301, `https://${CANONICAL_HOST}${p}${query}`)
})

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true
    : (origin, cb) => cb(null, !origin || origin.startsWith('http://localhost')),
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
})
app.use('/api/appointments', apiLimiter)
app.use('/api/contact', apiLimiter)
app.use('/api/demo', apiLimiter)

// El brief guarda una respuesta por cada pregunta (~25 llamadas en una sola sesión) — necesita un límite más alto que appointments/contact.
const briefLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
})
app.use('/api/brief', briefLimiter)

// API routes
app.use('/api/contact', contactRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/brief', briefRouter)
app.use('/api/demo', demoRouter)

// Health check
app.get('/api/salud', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV }))

// OAuth helper (solo desarrollo — generar refresh token)
if (process.env.NODE_ENV !== 'production') {
  const { google } = await import('googleapis')
  const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3001/oauth/callback'
  )
  app.get('/oauth/start', (_req, res) => {
    const url = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'consent',
    })
    res.redirect(url)
  })
  app.get('/oauth/callback', async (req, res) => {
    const code = req.query.code as string
    const { tokens } = await oauthClient.getToken(code)
    res.send(`<pre>REFRESH TOKEN:\n\n${tokens.refresh_token}\n\nCópialo y ponlo en .env como GOOGLE_REFRESH_TOKEN</pre>`)
  })
  app.get('/oauth/test', async (_req, res) => {
    const token = process.env.GOOGLE_REFRESH_TOKEN ?? ''
    const secret = process.env.GOOGLE_CLIENT_SECRET ?? ''
    const clientId = process.env.GOOGLE_CLIENT_ID ?? ''
    const body = new URLSearchParams({ client_id: clientId, client_secret: secret, refresh_token: token, grant_type: 'refresh_token' })
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    const data = await r.json()
    res.json({ status: r.status, data, token_prefix: token.slice(0, 25), client_prefix: clientId.slice(0, 20) })
  })
}

// Enlaces cortos para la demo gratis (respuesta "DEMO" por Instagram):
// abren WhatsApp del pais con el mensaje ya escrito. Instagram corta los
// DM a 1000 caracteres y los wa.me con ?text= quedaban largos y feos.
const DEMO_WHATSAPP_TEXT = encodeURIComponent('Hola, vengo de Instagram y quiero mi demo gratis. Mi negocio se llama: ')
const DEMO_WHATSAPP: Record<string, string> = {
  'demo-cl': '56965174454',
  'demo-ve': '584246515707',
}
for (const [route, phone] of Object.entries(DEMO_WHATSAPP)) {
  app.get(`/${route}`, (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('X-Robots-Tag', 'noindex')
    res.redirect(302, `https://wa.me/${phone}?text=${DEMO_WHATSAPP_TEXT}`)
  })
}

// Serve frontend in production
const dist = path.join(__dirname, '..', 'dist')

// Paginas prerenderizadas (scripts/prerender.mjs) — archivos PLANOS, no
// carpeta+index.html, a proposito: asi la URL que pide el navegador/bot y
// la URL declarada en canonical/sitemap/og:url son exactamente la misma,
// sin ningun redirect 301 de por medio.
const PRERENDERED_ROUTES = ['servicios', 'por-que-nosotros', 'proceso', 'contacto', 'agendar-cita']

// Si el prerender fallo en el build (no rompe el deploy a proposito, ver
// scripts/prerender.mjs), el .html de la ruta no existe: se sirve el HTML
// base y React renderiza la pagina en el navegador. Sin este respaldo la
// ruta respondia "Not Found" (paso en produccion el 2026-10-20). En ese
// caso ademas se escriben titulo/og:* en el HTML (ver lib/seoMeta.ts) para
// que WhatsApp/Facebook sigan mostrando la tarjeta del enlace.
const SEO_PAGES = loadSeoPages(path.join(__dirname, '..', 'src', 'lib', 'seo-pages.json'))
const pageCache = new Map<string, string>()

function sendPage(res: Response, route: string, file: string) {
  let html = pageCache.get(route)
  if (html === undefined) {
    const source = existsSync(file) ? file : path.join(dist, 'index.html')
    html = injectSeo(readFileSync(source, 'utf8'), SEO_PAGES, route)
    pageCache.set(route, html)
  }
  res.setHeader('Cache-Control', 'no-cache')
  res.type('html').send(html)
}

// "/" va antes de express.static, que si no serviria dist/index.html directo.
app.get('/', (_req, res) => sendPage(res, '/', path.join(dist, 'index.html')))
for (const route of PRERENDERED_ROUTES) {
  app.get(`/${route}`, (_req, res) => sendPage(res, `/${route}`, path.join(dist, `${route}.html`)))
}

// Assets con hash en el nombre (/assets/index-CMYwAiSn.js) -- cualquier cambio
// de contenido genera un nombre de archivo nuevo, asi que se pueden cachear
// "para siempre" sin riesgo de servir una version vieja. PageSpeed marcaba
// esto como el ahorro mas grande (1.6MB) porque antes TODO se servia con
// max-age=0 (cero cache) via express.static por defecto.
app.use('/assets', express.static(path.join(dist, 'assets'), {
  maxAge: '1y',
  immutable: true,
}))

// Resto de archivos estaticos (imagenes/video/logos en public/) -- no tienen
// hash en el nombre, asi que un cache largo con revalidacion es mas seguro
// que "immutable". Los .html se excluyen del cache largo: express.static
// serviria index.html/servicios.html/etc con el mismo maxAge, y despues de
// cada deploy el navegador seguiria mostrando la version vieja hasta que
// expire el cache.
app.use(express.static(dist, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache')
  },
}))
// Rutas que existen solo del lado del cliente, sin HTML prerenderizado propio
// ("/" ya se atiende arriba; queda aca por si llega con barra o mayusculas).
const SPA_ROUTES = new Set(['/', '/admin'])
const has404Page = existsSync(path.join(dist, '404.html'))

// Antes este comodin devolvia index.html con 200 para CUALQUIER URL: Google
// las veia como paginas reales ("soft 404" en Search Console) y PageSpeed
// recibia HTML al pedir /.well-known/ai-catalog.json. Ahora solo las rutas
// reales responden 200; el resto da 404 de verdad.
app.get('/{*path}', (req, res) => {
  const p = req.path.toLowerCase().replace(/\/+$/, '') || '/'
  if (SPA_ROUTES.has(p)) {
    res.sendFile(path.join(dist, 'index.html'))
    return
  }
  res.status(404)
  if (p.startsWith('/api/')) {
    res.json({ error: 'No encontrado' })
    return
  }
  // Archivos que no existen (.json, .png, .php...): 404 plano, sin HTML.
  if (path.extname(p)) {
    res.type('text/plain').send('Not found')
    return
  }
  // Paginas que no existen: 404.html prerenderizado (NotFound). Si el
  // prerender fallo en el build, el HTML base sirve igual: React muestra
  // NotFound al cargar.
  res.sendFile(path.join(dist, has404Page ? '404.html' : 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Techne Creativ] Servidor en puerto ${PORT}`)
})
