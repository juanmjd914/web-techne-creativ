import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App, { preloadRoute } from './App.tsx'

function mount() {
  // El HTML llega con titulo/meta/og ya escritos (por el prerender o por el
  // servidor) para bots que no ejecutan JS. React 19 agrega sus propias
  // etiquetas en vez de reusar esas, asi que se quitan antes de montar: si
  // no, al navegar a otra pagina quedaba el <title> de la pagina de entrada.
  document.head
    .querySelectorAll('title, meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]')
    .forEach(el => el.remove())

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
}

// Mientras baja el chunk de la pagina de entrada se sigue viendo el HTML
// prerenderizado; recien con el chunk listo React monta y lo reemplaza por
// lo mismo, sin dejar la pagina vacia (ver preloadRoute en App.tsx). Si la
// descarga falla, se monta igual y esa ruta cae al lazy normal.
preloadRoute(window.location.pathname).catch(() => {}).finally(mount)
