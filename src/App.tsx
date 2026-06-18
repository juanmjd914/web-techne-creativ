import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Servicios = lazy(() => import('./pages/Servicios').then(m => ({ default: m.Servicios })))
const PorQueNosotros = lazy(() => import('./pages/PorQueNosotros').then(m => ({ default: m.PorQueNosotros })))
const Proceso = lazy(() => import('./pages/Proceso').then(m => ({ default: m.Proceso })))
const Contacto = lazy(() => import('./pages/Contacto').then(m => ({ default: m.Contacto })))
const AgendarCita = lazy(() => import('./pages/AgendarCita').then(m => ({ default: m.AgendarCita })))
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })))

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
