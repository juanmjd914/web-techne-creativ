import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

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
