import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Mail, Calendar, Code2 } from 'lucide-react'
import { userAPI } from '../utils/api'

const About = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const aboutRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.get()
        setUserInfo(response.data)
      } catch (error) {
        console.error('Error fetching user info:', error)
        // setUserInfo({
        //   name: 'Saurav Kumar',
        //   summary: 'Passionate developer creating innovative solutions with modern technologies. Specializing in React, Node.js, and AI/ML applications.',
        //   location: 'India',
        //   email: 'contact@sauravkumar.dev'
        // })
        setUserInfo({
          Error:"Data is being loaded"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  useEffect(() => {
    const animateAbout = async () => {
      if (!contentRef.current || loading) return

      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        
        gsap.registerPlugin(ScrollTrigger)

        gsap.fromTo(contentRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        )
      } catch (error) {
        console.warn('GSAP not available for about animation')
      }
    }

    animateAbout()
  }, [loading])

  const stats = [
    { label: 'Projects Completed', value: '5+' },
    { label: 'Technologies Learned', value: '10+' },
    // { label: 'Years of Experience', value: '3+' },
    // { label: 'Happy Clients', value: '25+' },
  ]

  if (loading) {
    return (
      <section id="about" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={aboutRef} className="min-h-screen flex items-center section-padding scroll-mt-24">
      <div className="container-custom">
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="gradient-text">Me</span>
              </h2>
              
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  {userInfo?.summary || 'Passionate developer creating innovative solutions with modern technologies. Specializing in React, Node.js, and AI/ML applications.'}
                </p>
                
                <p>
                  I love turning complex problems into simple, beautiful, and intuitive solutions. 
                  When I'm not coding, you can find me exploring new technologies, contributing to open source projects, 
                  or sharing knowledge with the developer community.
                </p>

                <p>
                  My goal is to build applications that not only meet requirements but exceed expectations, 
                  creating memorable user experiences that make a difference.
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Get In Touch</h3>
              
              <div className="space-y-3">
                {userInfo?.location && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MapPin size={20} className="text-accent-500" />
                    <span>{userInfo.location}</span>
                  </div>
                )}
                
                {userInfo?.email && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail size={20} className="text-accent-500" />
                    <a 
                      href={`mailto:${userInfo.email}`}
                      className="hover:text-accent-500 transition-colors duration-300"
                    >
                      {userInfo.email}
                    </a>
                  </div>
                )}
                
                {/* <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar size={20} className="text-accent-500" />
                  <span>Available for freelance work</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Stats & Visual */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold text-accent-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Code Visual */}
            <div className="card p-6 font-mono text-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400">about.js</span>
              </div>
              
              <div className="space-y-2 text-gray-300">
                <div>
                  <span className="text-blue-400">const</span>{' '}
                  <span className="text-yellow-400">developer</span>{' '}
                  <span className="text-white">=</span>{' '}
                  <span className="text-green-400">&#123;</span>
                </div>
                <div className="ml-4">
                  <span className="text-purple-400">name:</span>{' '}
                  <span className="text-orange-400">'{userInfo?.name || 'Saurav Kumar'}'</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-purple-400">passion:</span>{' '}
                  <span className="text-orange-400">'Full Stack Development'</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-purple-400">location:</span>{' '}
                  <span className="text-orange-400">'{userInfo?.location || 'India'}'</span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-purple-400">status:</span>{' '}
                  <span className="text-green-400">'Available'</span>
                </div>
                <div>
                  <span className="text-green-400">&#125;</span>
                </div>
              </div>
            </div>

            {/* Skills Preview */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Code2 size={20} className="text-accent-500" />
                <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'JavaScript', 'Python', 'MySQL', 'Express'].map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700 hover:border-accent-500 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
