import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Projects from "./components/Projects"
import Experience from "./components/Experience"
import Testimonials from "./components/Testimonials"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton"

import ReviewPage from "./pages/ReviewPage"

import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import ProtectedRoute from "./admin/ProtectedRoute"

function Portfolio() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />

        <Route path="/review" element={<ReviewPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App