import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'
import { Home } from './pages/Home'
import { Servicios } from './pages/Servicios'
import { PorQueNosotros } from './pages/PorQueNosotros'
import { Proceso } from './pages/Proceso'
import { Contacto } from './pages/Contacto'
import { AgendarCita } from './pages/AgendarCita'
import { Admin } from './pages/Admin'

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/por-que-nosotros" element={<PorQueNosotros />} />
        <Route path="/proceso" element={<Proceso />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
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
