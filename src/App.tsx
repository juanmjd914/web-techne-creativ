import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense, type ComponentType } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'

const LOADERS: Record<string, () => Promise<ComponentType>> = {
  '/': () => import('./pages/Home').then(m => m.Home),
  '/servicios': () => import('./pages/Servicios').then(m => m.Servicios),
  '/por-que-nosotros': () => import('./pages/PorQueNosotros').then(m => m.PorQueNosotros),
  '/proceso': () => import('./pages/Proceso').then(m => m.Proceso),
  '/contacto': () => import('./pages/Contacto').then(m => m.Contacto),
  '/agendar-cita': () => import('./pages/AgendarCita').then(m => m.AgendarCita),
  '/admin': () => import('./pages/Admin').then(m => m.Admin),
  '*': () => import('./pages/NotFound').then(m => m.NotFound),
}

// La pagina de entrada se descarga ANTES de montar React (ver main.tsx) y se
// renderiza directo, sin pasar por lazy/Suspense. Con lazy, el primer render
// mostraba el fallback (null) y borraba el contenido prerenderizado hasta que
// llegaba el chunk: el footer subia y bajaba y PageSpeed media CLS = 1.
const preloaded: Record<string, ComponentType> = {}

function routeKey(pathname: string) {
  const p = pathname.toLowerCase().replace(/\/+$/, '') || '/'
  return p in LOADERS ? p : '*'
}

export async function preloadRoute(pathname: string) {
  const key = routeKey(pathname)
  preloaded[key] = await LOADERS[key]()
}

function page(key: string) {
  const Lazy = lazy(() => LOADERS[key]().then(C => ({ default: C })))
  return function Page() {
    const Preloaded = preloaded[key]
    return Preloaded ? <Preloaded /> : <Lazy />
  }
}

const Home = page('/')
const Servicios = page('/servicios')
const PorQueNosotros = page('/por-que-nosotros')
const Proceso = page('/proceso')
const Contacto = page('/contacto')
const AgendarCita = page('/agendar-cita')
const Admin = page('/admin')
const NotFound = page('*')

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isAdmin = pathname.toLowerCase() === '/admin'
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/por-que-nosotros" element={<PorQueNosotros />} />
          <Route path="/proceso" element={<Proceso />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/agendar-cita" element={<AgendarCita />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
