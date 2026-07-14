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

import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const PORT = 4610

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
]

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      // servidor aun no listo
    }
    await new Promise((r) => setTimeout(r, 300))
  }
  throw new Error(`vite preview no respondio en ${timeoutMs}ms`)
}

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
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: root, shell: true, stdio: 'pipe' },
  )
  preview.stderr.on('data', (d) => process.stderr.write(`[vite preview] ${d}`))

  let browser
  try {
    await waitForServer(`http://localhost:${PORT}/`)

    // --no-sandbox / --disable-setuid-sandbox: casi siempre necesarios para
    // correr Chromium como root dentro de un contenedor de build (Hostinger,
    // GitHub Actions, etc.) — sin esto, Chromium no arranca en esos entornos.
    browser = await puppeteer.launch({
      headless: true,
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

    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route.path}`
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
    if (browser) await browser.close()
    preview.kill('SIGKILL')
  }
}

// Timeout duro: si Chromium tarda en arrancar (primer uso en un entorno
// nuevo puede colgarse por escaneo de antivirus, permisos, o falta de
// librerias del sistema) o cualquier otro paso se atasca, el build sigue
// de largo en vez de quedar esperando para siempre.
const TIMEOUT_MS = 60_000
const withTimeout = Promise.race([
  prerender(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`[prerender] timeout de ${TIMEOUT_MS}ms — abortando`)), TIMEOUT_MS),
  ),
])

withTimeout.catch((err) => {
  console.error('[prerender] FALLO — el sitio se sube SIN prerender esta vez (no bloquea el deploy):')
  console.error(err)
  // process.exit(0) (no 1) a proposito: si Chromium no puede correr en este
  // entorno (host compartido sin librerias del sistema, o se cuelga en el
  // primer arranque), preferimos deployar el dist/ normal de Vite antes que
  // tumbar el build entero o dejarlo colgado para siempre. El prerender es
  // una mejora, no un requisito para que el sitio funcione.
  process.exit(0)
})
