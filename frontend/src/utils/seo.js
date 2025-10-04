// SEO utility functions
export const generateMetaTags = (pageData) => {
  const defaultData = {
    title: 'Saurav Kumar - Full Stack Developer & AI Engineer',
    description: 'Portfolio of Saurav Kumar - Full Stack Developer specializing in React, Node.js, and AI/ML applications. View my projects, skills, and get in touch.',
    keywords: 'Saurav Kumar, Full Stack Developer, React, Node.js, AI Engineer, Portfolio, Web Development',
    image: 'https://sauravkumar.dev/og-image.jpg',
    url: 'https://sauravkumar.dev'
  }

  const data = { ...defaultData, ...pageData }

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      type: 'website',
      url: data.url,
      image: data.image,
      siteName: 'Saurav Kumar Portfolio'
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      image: data.image
    }
  }
}

export const updatePageTitle = (title) => {
  document.title = title
}

export const updateMetaTag = (name, content) => {
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}

export const updateOpenGraphTag = (property, content) => {
  let meta = document.querySelector(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.content = content
}
