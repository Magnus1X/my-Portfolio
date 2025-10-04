import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Components
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ThreeBackground from './components/ThreeBackground'
import ScrollProgress from './components/ScrollProgress'

// Admin Components
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'

// Hooks
import { useLenis } from './hooks/useLenis'
import { useScrollTrigger } from './hooks/useScrollTrigger'
import { useSEO } from './hooks/useSEO'

// Utils
import { addSkipLink } from './utils/accessibility'

function App() {
  const { lenis } = useLenis()
  useScrollTrigger()

  // SEO for main portfolio page
  useSEO({
    title: 'Saurav Kumar - Full Stack Developer & AI Engineer',
    description: 'Portfolio of Saurav Kumar - Full Stack Developer specializing in React, Node.js, and AI/ML applications. View my projects, skills, and get in touch.',
    keywords: 'Saurav Kumar, Full Stack Developer, React, Node.js, AI Engineer, Portfolio, Web Development, JavaScript, TypeScript, Python'
  })

  useEffect(() => {
    // Add skip link for accessibility
    addSkipLink()

    // Initialize GSAP ScrollTrigger
    const { gsap } = window
    if (gsap && gsap.registerPlugin) {
      gsap.registerPlugin(window.ScrollTrigger)
    }

    // Hide preloader after everything is loaded
    const hidePreloader = () => {
      const preloader = document.getElementById('preloader')
      if (preloader) {
        if (gsap) {
          gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              preloader.style.display = 'none'
              // Announce to screen readers that page is loaded
              const announcement = document.createElement('div')
              announcement.setAttribute('aria-live', 'polite')
              announcement.setAttribute('aria-atomic', 'true')
              announcement.className = 'sr-only'
              announcement.textContent = 'Portfolio loaded successfully'
              document.body.appendChild(announcement)
              setTimeout(() => document.body.removeChild(announcement), 1000)
            }
          })
        } else {
          // Fallback if GSAP is not available
          preloader.style.opacity = '0'
          setTimeout(() => {
            preloader.style.display = 'none'
          }, 500)
        }
      }
    }

    // Force hide preloader after 5 seconds as a safety measure
    const safetyTimeout = setTimeout(() => {
      const preloader = document.getElementById('preloader')
      if (preloader && preloader.style.display !== 'none') {
        preloader.style.display = 'none'
        console.log('Preloader force-removed by safety timeout in App.jsx')
      }
    }, 5000)

    // Wait for all resources to load
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 800)
    } else {
      window.addEventListener('load', () => {
        setTimeout(hidePreloader, 800)
      })
    }

    return () => {
      window.removeEventListener('load', hidePreloader)
      clearTimeout(safetyTimeout)
    }
  }, [])

  return (
    <div className="App">
      <ThreeBackground />
      <ScrollProgress />
      
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={
          <>
            <Navbar />
            <main id="main-content" className="relative z-10" role="main" aria-label="Main content">
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Certificates />
              <Contact />
            </main>
            <Footer />
          </>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #475569',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
