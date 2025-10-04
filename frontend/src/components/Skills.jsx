import React, { useEffect, useRef, useState } from 'react'
import { Code2, Database, Palette, Cpu } from 'lucide-react'
import { skillsAPI } from '../utils/api'

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const skillsRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillsAPI.getAll()
        setSkills(response.data)
      } catch (error) {
        console.error('Error fetching skills:', error)
        // Set fallback skills
        setSkills([
          {
            id: '1',
            name: 'React',
            svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12.765c.688 0 1.25-.562 1.25-1.25s-.562-1.25-1.25-1.25-1.25.562-1.25 1.25.562 1.25 1.25 1.25zm0-6.5c3.516 0 6.25 2.734 6.25 6.25s-2.734 6.25-6.25 6.25-6.25-2.734-6.25-6.25 2.734-6.25 6.25-6.25zm0-1.25c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5-3.358-7.5-7.5-7.5z"/></svg>',
            category: 'Frontend'
          },
          {
            id: '2',
            name: 'Node.js',
            svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            category: 'Backend'
          },
          {
            id: '3',
            name: 'JavaScript',
            svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
            category: 'Programming'
          },
          {
            id: '4',
            name: 'TypeScript',
            svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
            category: 'Programming'
          },
          {
            id: '5',
            name: 'Python',
            svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            category: 'Programming'
          },
          {
            id: '6',
            name: 'MySQL',
            svgIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
            category: 'Database'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  useEffect(() => {
    const animateSkills = async () => {
      if (!contentRef.current || loading) return

      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        
        gsap.registerPlugin(ScrollTrigger)

        // Animate skill cards
        gsap.fromTo(contentRef.current.querySelectorAll('.skill-card'),
          { opacity: 0, y: 50, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play none none reverse"
            }
          }
        )
      } catch (error) {
        console.warn('GSAP not available for skills animation')
      }
    }

    animateSkills()
  }, [loading])

  const categoryIcons = {
    'Frontend': Palette,
    'Backend': Code2,
    'Programming': Cpu,
    'Database': Database,
    'Technical': Code2,
    'Soft': Palette,
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Technical'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {})

  if (loading) {
    return (
      <section id="skills" className="min-h-screen flex items-center justify-center scroll-mt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading skills...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" ref={skillsRef} className="min-h-screen flex items-center section-padding scroll-mt-24">
      <div className="container-custom">
        <div ref={contentRef} className="space-y-16">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My <span className="gradient-text">Skills</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Skills by Category */}
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => {
              const Icon = categoryIcons[category] || Code2
              return (
                <div key={category} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center space-x-3">
                    <Icon size={24} className="text-accent-500" />
                    <h3 className="text-2xl font-semibold text-white">{category}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="skill-card card p-4 text-center group hover:scale-105 transition-all duration-300 hover:border-accent-500/50"
                      >
                        <div 
                          className="w-12 h-12 mx-auto mb-3"
                          dangerouslySetInnerHTML={{ __html: normalizeSVG(skill.svgIcon) }}
                        />
                        <h4 className="text-sm font-medium text-white group-hover:text-accent-500 transition-colors duration-300">
                          {skill.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Skills Summary */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="card text-center p-6">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2 size={32} className="text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Frontend Development</h3>
              <p className="text-gray-400">
                Creating responsive and interactive user interfaces with modern frameworks
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database size={32} className="text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Backend Development</h3>
              <p className="text-gray-400">
                Building scalable APIs and server-side applications with robust architectures
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cpu size={32} className="text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Problem Solving & Coding</h3>
              <p className="text-gray-400">
                Strong problem-solving abilities using Python, C++ using Data Structures and Algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
// Helpers
function normalizeSVG(svg) {
  if (!svg || typeof svg !== 'string') return ''
  const trimmed = svg.trim()
  if (trimmed.startsWith('<svg')) return trimmed
  // Wrap path-only/svg fragments into a full SVG for consistent rendering
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">${trimmed}</svg>`
}
