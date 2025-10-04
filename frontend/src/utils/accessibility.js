// Accessibility utility functions

export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  )
  
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

export const addSkipLink = () => {
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent-500 text-white px-4 py-2 rounded z-50'
  
  document.body.insertBefore(skipLink, document.body.firstChild)
}

export const setFocusOnElement = (element) => {
  if (element && typeof element.focus === 'function') {
    element.focus()
  }
}

export const isElementVisible = (element) => {
  if (!element) return false
  
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  )
}

export const reduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const highContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches
}
