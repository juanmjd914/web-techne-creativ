// Prerenderizado post-build: renderiza cada ruta publica con Chrome headless
// (dump-dom, JS ya ejecutado) y guarda un HTML estatico por ruta en dist/.
// Asi Google y cualquier bot que no ejecute JS (WhatsApp, ClaudeBot, GPTBot...)
// reciben el contenido real en el primer fetch, no un <div id="root"></div> vacio.
//
// express.static ya sirve dist/<ruta>/index.html automaticamente cuando existe
// (comportamiento estandar de servidores estaticos) — no hace falta tocar server/index.ts.

import { spawn, execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const PORT = 4610
const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

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

function dumpDom(url) {
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--virtual-time-budget=8000',
    '--run-all-compositor-stages-before-draw',
    '--dump-dom',
    `--user-data-dir=${process.env.TEMP}\\chrome-prerender-${Date.now()}`,
    url,
  ]
  return execFileSync(CHROME, args, { maxBuffer: 20 * 1024 * 1024 }).toString('utf-8')
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

function killProcessTree(pid) {
  try {
    execFileSync('taskkill', ['/pid', String(pid), '/t', '/f'], { stdio: 'ignore' })
  } catch {
    // ya estaba muerto o no existe — no es un error real
  }
}

async function main() {
  console.log('[prerender] iniciando vite preview en puerto', PORT)
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: root, shell: true, stdio: 'pipe' },
  )
  preview.stderr.on('data', (d) => process.stderr.write(`[vite preview] ${d}`))

  try {
    await waitForServer(`http://localhost:${PORT}/`)
    console.log('[prerender] servidor listo, prerenderizando', ROUTES.length, 'rutas')

    // Primero se capturan TODOS los snapshots en memoria y recien al final se
    // escriben a disco. Si escribieramos ruta por ruta, la primera escritura
    // (por ejemplo dist/index.html) contaminaria el fallback SPA que sirve
    // vite preview para las rutas siguientes — el snapshot de Home quedaba
    // sirviendose como base para /servicios, /proceso, etc., y su <title>
    // colaba junto al correcto (bug real detectado y confirmado 2026-07-14).
    const snapshots = []

    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route.path}`
      console.log('[prerender]', route.path, '->', route.out)
      let html = dumpDom(url)

      if (!html.includes('<div id="root">') || html.length < 2000) {
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
    // En Windows, spawn con shell:true crea un cmd.exe envolviendo el proceso
    // real de node/vite — preview.kill() solo mata el wrapper y deja el
    // servidor huerfano escuchando el puerto. taskkill /t mata el arbol completo.
    if (preview.pid) killProcessTree(preview.pid)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
