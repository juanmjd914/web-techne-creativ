// Prerenderizado post-build: renderiza cada ruta publica con Chromium
// (puppeteer, portatil — se instala solo, sin depender de un Chrome del
// sistema) y guarda un HTML estatico por ruta en dist/. Asi Google y
// cualquier bot que no ejecute JS (WhatsApp, ClaudeBot, GPTBot...) reciben
// el contenido real en el primer fetch, no un <div id="root"></div> vacio.
//
// Si por lo que sea Chromium no puede arrancar en el entorno de build
// (ej. faltan librerias del sistema en un host compartido), el script NO
// rompe el build: avisa y sigue con el dist/ normal de Vite (sin prerender)
// en vez de dejar el deploy entero caido.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')

// Sin servidor: Chromium navega a un origen ficticio y cada pedido se
// responde leyendo el archivo de dist/ (intercepcion de requests). El build
// de Hostinger no permite conexiones a 127.0.0.1 (confirmado 2026-10-29):
// el `vite preview` en localhost que se usaba antes nunca respondia. Sin
// servidor no hay puertos, procesos huerfanos ni red local de por medio.
const ORIGIN = 'http://prerender.local'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

// Mismo criterio que el fallback SPA de vite preview: si la ruta apunta a un
// archivo que existe en dist/ se entrega ese archivo; si no (rutas de React
// como /servicios), se entrega index.html y React arma la pagina.
// index.html se lee UNA vez al inicio, antes de escribir ningun snapshot (ver
// el comentario de "snapshots" mas abajo sobre la contaminacion del fallback).
let indexHtml

function resolveRequest(pathname) {
  const rel = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '')
  const file = join(distDir, rel)
  // Nada fuera de dist/ (ej. /../package.json).
  if (rel && file.startsWith(distDir) && extname(rel) && existsSync(file) && statSync(file).isFile()) {
    return { status: 200, contentType: MIME[extname(rel).toLowerCase()] || 'application/octet-stream', body: readFileSync(file) }
  }
  if (extname(rel) && rel !== 'index.html') {
    return { status: 404, contentType: 'text/plain; charset=utf-8', body: 'not found' }
  }
  return { status: 200, contentType: MIME['.html'], body: indexHtml }
}

// Archivos PLANOS (servicios.html, no servicios/index.html) a proposito:
// dejar que Express sirva un directorio por su index.html requiere el
// redirect automatico de trailing-slash de serve-static, lo que abre un
// 301 en cada URL del sitemap/canonical (/servicios -> /servicios/) y deja
// la URL declarada sin coincidir con la que Google termina indexando.
// Con archivos planos + rutas explicitas en server/index.ts no hace falta
// ningun redirect: la URL declarada y la servida son exactamente la misma.
const ROUTES = [
  { path: '/', out: 'index.html' },
  { path: '/servicios', out: 'servicios.html' },
  { path: '/por-que-nosotros', out: 'por-que-nosotros.html' },
  { path: '/proceso', out: 'proceso.html' },
  { path: '/contacto', out: 'contacto.html' },
  { path: '/agendar-cita', out: 'agendar-cita.html' },
  // Cualquier URL inexistente cae en la ruta "*" de React (NotFound); el
  // servidor la entrega con status 404 (ver server/index.ts).
  { path: '/__pagina-no-encontrada', out: '404.html' },
]

// Defensa: si alguna vez vuelve a colarse un <title> o meta duplicado
// (ej. alguien reintroduce un tag estatico en index.html), nos quedamos
// solo con la ULTIMA aparicion de cada uno — es la que renderizo Helmet
// por encima de cualquier base estatica.
function dedupeHead(html) {
  const dedupeTag = (regex) => {
    const matches = [...html.matchAll(regex)]
    if (matches.length <= 1) return
    for (const m of matches.slice(0, -1)) {
      html = html.replace(m[0], '')
    }
  }
  dedupeTag(/<title>.*?<\/title>/g)
  dedupeTag(/<meta[^>]*name="description"[^>]*>/g)
  dedupeTag(/<meta[^>]*property="og:title"[^>]*>/g)
  dedupeTag(/<meta[^>]*property="og:description"[^>]*>/g)
  dedupeTag(/<meta[^>]*property="og:url"[^>]*>/g)
  dedupeTag(/<link[^>]*rel="canonical"[^>]*>/g)
  return html
}

async function prerender() {
  indexHtml = readFileSync(join(distDir, 'index.html'))

  let browser
  try {
    // --no-sandbox / --disable-setuid-sandbox: casi siempre necesarios para
    // correr Chromium como root dentro de un contenedor de build (Hostinger,
    // GitHub Actions, etc.) — sin esto, Chromium no arranca en esos entornos.
    // pipe: true habla con Chromium por stdin/stdout del proceso en vez de un
    // WebSocket a 127.0.0.1, que el build de Hostinger no permite. Sin esto
    // el launch fallaba alla con un error sin stack ("[object Object]").
    browser = await puppeteer.launch({
      headless: true,
      pipe: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    })
    console.log('[prerender] Chromium listo, prerenderizando', ROUTES.length, 'rutas')

    // Primero se capturan TODOS los snapshots en memoria y recien al final se
    // escriben a disco. Si escribieramos ruta por ruta, la primera escritura
    // (por ejemplo dist/index.html) contaminaria el fallback SPA que sirve
    // vite preview para las rutas siguientes — el snapshot de Home quedaba
    // sirviendose como base para /servicios, /proceso, etc., y su <title>
    // colaba junto al correcto (bug real detectado y confirmado 2026-07-14).
    const snapshots = []
    const page = await browser.newPage()

    // Todo lo que no sea del origen ficticio (GA4, gtag, etc.) se bloquea:
    // el snapshot es el DOM que arma React y no depende de terceros, y asi
    // el build no registra visitas falsas en Analytics.
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const url = new URL(req.url())
      if (url.origin !== ORIGIN) return req.abort()
      const { status, contentType, body } = resolveRequest(url.pathname)
      req.respond({ status, contentType, body })
    })

    for (const route of ROUTES) {
      const url = `${ORIGIN}${route.path}`
      console.log('[prerender]', route.path, '->', route.out)
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 })
      let html = await page.content()

      if (!html.includes('id="root"') || html.length < 2000) {
        throw new Error(
          `[prerender] snapshot sospechoso para ${route.path} (${html.length} chars) — abortando sin escribir`,
        )
      }

      html = dedupeHead(html)
      snapshots.push({ outPath: join(distDir, route.out), html })
    }
    for (const { outPath, html } of snapshots) {
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, html, 'utf-8')
    }

    console.log('[prerender] listo — dist/ actualizado con HTML prerenderizado por ruta')
  } finally {
    if (browser) await browser.close().catch(() => {})
  }
}

// Timeout duro: si Chromium tarda en arrancar (primer uso en un entorno
// nuevo puede colgarse por escaneo de antivirus, permisos, o falta de
// librerias del sistema) o cualquier otro paso se atasca, el build sigue
// de largo en vez de quedar esperando para siempre.
// 60s quedo corto en Hostinger con 7 rutas (2026-10-20: el build salio sin
// ningun HTML prerenderizado). Como los snapshots se escriben recien al final,
// un timeout pierde TODAS las rutas, no solo la ultima.
const TIMEOUT_MS = 180_000
const withTimeout = Promise.race([
  prerender(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`[prerender] timeout de ${TIMEOUT_MS}ms — abortando`)), TIMEOUT_MS),
  ),
])

withTimeout
  .then(() => {
    // Salida forzada tambien en el camino feliz: si algo (ej. un Chromium que
    // no termino de cerrar) deja el event loop vivo, el build no debe quedar
    // colgado. Ya paso en Hostinger con el vite preview de antes: el log
    // mostraba "[prerender] listo" pero el build seguia 15+ minutos hasta que
    // Hostinger lo mataba y lo reportaba como "Failed to build the application".
    process.exit(0)
  })
  .catch((err) => {
    console.error('[prerender] FALLO — el sitio se sube SIN prerender esta vez (no bloquea el deploy):')
    console.error(err)
    // process.exit(0) (no 1) a proposito: si Chromium no puede correr en este
    // entorno (host compartido sin librerias del sistema, o se cuelga en el
    // primer arranque), preferimos deployar el dist/ normal de Vite antes que
    // tumbar el build entero o dejarlo colgado para siempre. El prerender es
    // una mejora, no un requisito para que el sitio funcione.
    process.exit(0)
  })
