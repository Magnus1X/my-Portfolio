import { useEffect } from 'react'

export const useScrollTrigger = () => {
  useEffect(() => {
    // Load GSAP and ScrollTrigger dynamically
    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        
        gsap.registerPlugin(ScrollTrigger)

        // Set up global ScrollTrigger configurations
        ScrollTrigger.config({
          ignoreMobileResize: true,
          syncInterval: 150,
        })

        // Create a global ScrollTrigger refresh function
        window.refreshScrollTrigger = () => {
          ScrollTrigger.refresh()
        }

        // Set up intersection observer for better performance
        ScrollTrigger.observe({
          target: window,
          type: "scroll,wheel,touch",
          onUp: () => ScrollTrigger.refresh(),
          onDown: () => ScrollTrigger.refresh(),
        })

        return { gsap, ScrollTrigger }
      } catch (error) {
        console.warn('GSAP or ScrollTrigger could not be loaded:', error)
        return null
      }
    }

    loadGSAP()

    return () => {
      // Cleanup function
      if (window.refreshScrollTrigger) {
        delete window.refreshScrollTrigger
      }
    }
  }, [])
}
