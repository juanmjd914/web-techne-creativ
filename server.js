// Hostinger entry point — dynamic import para capturar errores de arranque
async function start() {
  try {
    await import('./server-dist/index.js')
  } catch (e) {
    console.error('[server.js] Error al iniciar el servidor:', e)
    process.exit(1)
  }
}

start()
