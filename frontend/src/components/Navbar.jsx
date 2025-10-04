import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Code, User, Briefcase, Award, Mail, Home } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id)
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Calculate an offset to account for the floating navbar and scroll margins
      const navEl = document.querySelector('nav')
      const baseOffset = navEl ? navEl.offsetHeight : 80
      const scrollMargin = 24 // matches scroll-mt-24 used on sections
      const offset = baseOffset + scrollMargin

      // Prefer Lenis smooth scroll if available
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(element, { offset: -offset, duration: 1 })
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-5xl px-4">
      <div className="glass rounded-full px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">SK</span>
            </div>
            <span className="text-[var(--color-text)] font-semibold text-lg hidden sm:block">Saurav Kumar</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.id) }}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-md'
                      : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)] hover:bg-opacity-50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              )
            })}
          </div>

          {/* Admin Link - Hidden from regular users */}
          {false && (
            <Link
              to="/admin"
              className="hidden md:block text-xs text-gray-400 hover:text-accent-500 transition-colors duration-300 font-mono"
            >
              Admin
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToSection(item.id) }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-accent-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                )
              })}
              <Link
                to="/admin"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-accent-500 hover:bg-gray-800 transition-all duration-300"
              >
                <span className="font-mono text-sm">Admin Panel</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
