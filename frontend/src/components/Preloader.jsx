import React, { useEffect, useRef } from 'react'

const Preloader = () => {
  const preloaderRef = useRef(null)

  useEffect(() => {
    // GSAP animation for preloader
    const animatePreloader = async () => {
      try {
        const { gsap } = await import('gsap')
        
        const tl = gsap.timeline()
        
        tl.fromTo(preloaderRef.current, 
          { opacity: 1 },
          { opacity: 0, duration: 0.5, delay: 2 }
        )
        .set(preloaderRef.current, { display: 'none' })
      } catch (error) {
        console.warn('GSAP not available for preloader animation')
        // Fallback: hide preloader after 2 seconds
        setTimeout(() => {
          if (preloaderRef.current) {
            preloaderRef.current.style.display = 'none'
          }
        }, 2000)
      }
    }

    animatePreloader()
  }, [])

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      id="preloader"
    >
      <div className="text-center">
        {/* Animated Logo/Text */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Saurav Kumar
          </h1>
          <p className="text-gray-400 text-lg">
            Full Stack Developer & AI Engineer
          </p>
        </div>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-500 font-mono text-sm">
          Loading Portfolio<span className="loading-dots"></span>
        </p>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full mt-6 mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-accent-500 to-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default Preloader
