// Shared smooth scroll utility with navbar offset and section scroll margin
export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (!element) return

  const navEl = document.querySelector('nav')
  const baseOffset = navEl ? navEl.offsetHeight : 80
  const scrollMargin = 24 // matches scroll-mt-24 used on sections
  const offset = baseOffset + scrollMargin

  if (window.lenis && typeof window.lenis.scrollTo === 'function') {
    window.lenis.scrollTo(element, { offset: -offset, duration: 1 })
  } else {
    const y = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}