import { useEffect } from 'react'
import { generateMetaTags, updatePageTitle, updateMetaTag, updateOpenGraphTag } from '../utils/seo'

export const useSEO = (pageData) => {
  useEffect(() => {
    const metaData = generateMetaTags(pageData)

    // Update page title
    updatePageTitle(metaData.title)

    // Update meta tags
    updateMetaTag('description', metaData.description)
    updateMetaTag('keywords', metaData.keywords)

    // Update Open Graph tags
    updateOpenGraphTag('og:title', metaData.openGraph.title)
    updateOpenGraphTag('og:description', metaData.openGraph.description)
    updateOpenGraphTag('og:type', metaData.openGraph.type)
    updateOpenGraphTag('og:url', metaData.openGraph.url)
    updateOpenGraphTag('og:image', metaData.openGraph.image)
    updateOpenGraphTag('og:site_name', metaData.openGraph.siteName)

    // Update Twitter Card tags
    updateMetaTag('twitter:card', metaData.twitter.card)
    updateMetaTag('twitter:title', metaData.twitter.title)
    updateMetaTag('twitter:description', metaData.twitter.description)
    updateMetaTag('twitter:image', metaData.twitter.image)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = metaData.openGraph.url

  }, [pageData])
}
