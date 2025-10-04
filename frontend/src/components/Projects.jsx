import React, { useEffect, useRef, useState } from 'react'
import { ExternalLink, Github, Eye, Calendar } from 'lucide-react'
import { projectsAPI } from '../utils/api'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const projectsRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll()
        setProjects(response.data)
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Set fallback projects
        setProjects([
          {
            id: '1',
            title: 'E-Commerce Platform',
            description: 'A full-stack e-commerce application built with React, Node.js, and MySQL. Features include user authentication, product management, shopping cart, and payment integration.',
            techStack: 'React, Node.js, Express, MySQL, Stripe API',
            liveUrl: 'https://ecommerce-demo.com',
            githubUrl: 'https://github.com/sauravkumar/ecommerce',
            featured: true,
            imageUrl: ''
          },
          {
            id: '2',
            title: 'AI Chat Application',
            description: 'Real-time chat application with AI integration using OpenAI API. Built with React for frontend and Node.js for backend with WebSocket support.',
            techStack: 'React, Node.js, Socket.io, OpenAI API, MongoDB',
            liveUrl: 'https://ai-chat-demo.com',
            githubUrl: 'https://github.com/sauravkumar/ai-chat',
            featured: true,
            imageUrl: ''
          },
          {
            id: '3',
            title: 'Portfolio Website',
            description: 'Responsive portfolio website with modern animations and smooth scrolling. Built with React, GSAP, and Three.js for interactive 3D elements.',
            techStack: 'React, GSAP, Three.js, TailwindCSS, Vite',
            liveUrl: 'https://sauravkumar.dev',
            githubUrl: 'https://github.com/sauravkumar/portfolio',
            featured: false,
            imageUrl: ''
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    const animateProjects = async () => {
      if (!contentRef.current || loading) return

      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        
        gsap.registerPlugin(ScrollTrigger)

        // Animate project cards with tilt effect
        gsap.fromTo(contentRef.current.querySelectorAll('.project-card'),
          { opacity: 0, y: 100, rotationX: -15 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectsRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            }
          }
        )

        // Add hover tilt effect
        contentRef.current.querySelectorAll('.project-card').forEach(card => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const rotateX = (y - centerY) / 10
            const rotateY = (centerX - x) / 10
            
            gsap.to(card, {
              rotationX: rotateX,
              rotationY: rotateY,
              duration: 0.3,
              transformPerspective: 1000,
              transformOrigin: "center center"
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.5,
              ease: "power2.out"
            })
          })
        })
      } catch (error) {
        console.warn('GSAP not available for projects animation')
      }
    }

    animateProjects()
  }, [loading])

  const featuredProjects = projects.filter(project => project.featured)
  const otherProjects = projects.filter(project => !project.featured)

  if (loading) {
    return (
      <section id="projects" className="min-h-screen flex items-center justify-center scroll-mt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" ref={projectsRef} className="min-h-screen flex items-center section-padding scroll-mt-24">
      <div className="container-custom">
        <div ref={contentRef} className="space-y-16">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work and side projects
            </p>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-white mb-8">🌟 Featured Work</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} featured={true} />
                ))}
              </div>
            </div>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-white mb-8">💼 More Projects</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} featured={false} />
                ))}
              </div>
            </div>
          )}

          
        </div>
      </div>
    </section>
  )
}

const ProjectCard = ({ project, featured = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className={`project-card card group overflow-hidden perspective-1000 preserve-3d backface-hidden ${
      featured ? 'lg:col-span-1' : ''
    }`}>
      {/* Project Image */}
      <div className="relative h-48 bg-gray-800 rounded-lg mb-4 overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent-500/20 to-blue-600/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <ExternalLink size={32} className="text-accent-500" />
              </div>
              <p className="text-gray-400 text-sm">Project Preview</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
                aria-label="View live project"
              >
                <Eye size={20} className="text-white" />
              </a>
            )}
            
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
                aria-label="View source code"
              >
                <Github size={20} className="text-white" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-500 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack?.split(',').map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
            >
              {tech.trim()}
            </span>
          ))}
        </div>

        {/* Project Links */}
        <div className="flex items-center space-x-4 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-accent-500 hover:text-accent-400 transition-colors duration-300"
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">Live Demo</span>
            </a>
          )}
          
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <Github size={16} />
              <span className="text-sm font-medium">Source Code</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects
