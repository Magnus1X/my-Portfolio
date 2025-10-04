import { useEffect, useState } from 'react'
import Lenis from 'lenis'

export const useLenis = () => {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    setLenis(lenisInstance)
    // Expose instance globally for programmatic scrolling from components
    window.lenis = lenisInstance

    // Animation frame loop
    function raf(time) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenisInstance.destroy()
      if (window.lenis === lenisInstance) {
        delete window.lenis
      }
    }
  }, [])

  return { lenis }
}
