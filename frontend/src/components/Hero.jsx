import React, { useEffect, useRef, useState } from 'react'
import { scrollToSection } from '../utils/scroll'
import { Download, Github, Linkedin, Mail, Code2, Trophy } from 'lucide-react'
import { getFileUrl } from '../utils/api'
import { userAPI } from '../utils/api'

const Hero = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.get()
        setUserInfo(response.data)
      } catch (error) {
        console.error('Error fetching user info:', error)
        // Set fallback data
        setUserInfo({
          name: 'Saurav Kumar',
          tagline: 'Full Stack Developer & AI Engineer',
          summary: 'Passionate developer creating innovative solutions with modern technologies.',
          linkedin: '',
          github: '',
          codeforces: '',
          leetcode: '',
          cvUrl: '/uploads/cv-1759516793167-968302336.pdf'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  useEffect(() => {
    const animateHero = async () => {
      if (!textRef.current || loading) return

      try {
        const { gsap } = await import('gsap')
        
        const tl = gsap.timeline()
        
        // Animate text elements
        tl.fromTo(textRef.current.children, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
          }
        )
      } catch (error) {
        console.warn('GSAP not available for hero animation')
      }
    }

    animateHero()
  }, [loading])

  const buildSocialLinks = () => {
    const links = []
    if (userInfo?.github) links.push({ name: 'GitHub', url: userInfo.github, icon: Github })
    if (userInfo?.linkedin) links.push({ name: 'LinkedIn', url: userInfo.linkedin, icon: Linkedin })
    if (userInfo?.codeforces) links.push({ name: 'Codeforces', url: `https://codeforces.com/profile/${userInfo.codeforces}`, icon: Code2 })
    if (userInfo?.leetcode) links.push({ name: 'LeetCode', url: `https://leetcode.com/${userInfo.leetcode}/`, icon: Trophy })
    if (userInfo?.email) links.push({ name: 'Email', url: `mailto:${userInfo.email}`, icon: Mail })
    return links
  }

  const socialLinks = buildSocialLinks()

  if (loading) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="hero" ref={heroRef} className="min-h-screen flex items-center justify-center section-padding scroll-mt-24 pt-36">
      <div className="container-custom text-center">
        <div ref={textRef} className="space-y-8">
          {/* Profile Photo */}
          {userInfo?.profilePhoto && (
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={getFileUrl(userInfo.profilePhoto)}
                  alt={userInfo.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent-500/30 shadow-2xl"
                />
                <div className="absolute inset-0 rounded-full border-4 border-accent-500/50 animate-ping"></div>
              </div>
            </div>
          )}

          {/* Name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold gradient-text text-shadow-lg">
            {userInfo?.name || 'Saurav Kumar'}
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light max-w-4xl mx-auto">
            {userInfo?.tagline || 'Full Stack Developer & AI Engineer'}
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {userInfo?.summary || 'Passionate developer creating innovative solutions with modern technologies. Specializing in React, Node.js, and AI/ML applications.'}
          </p>

          {/* Location */}
          {userInfo?.location && (
            <p className="text-gray-500 flex items-center justify-center space-x-2">
              <span>📍</span>
              <span>{userInfo.location}</span>
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            {userInfo?.cvUrl && (
              <a
                href={getFileUrl(userInfo.cvUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center space-x-2 group"
              >
                <Download size={20} />
                <span>Download CV</span>
              </a>
            )}
            
            <a
              href="/#contact"
              onClick={(e) => { e.preventDefault(); scrollToSection('contact') }}
              className="btn-secondary flex items-center space-x-2 group"
            >
              <Mail size={20} />
              <span>Get In Touch</span>
            </a>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center space-x-6 pt-8">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-500 transition-all duration-300 transform hover:scale-110 hover:drop-shadow-lg"
                    aria-label={social.name}
                  >
                    <Icon size={24} />
                  </a>
                )
              })}
            </div>
          )}

          {/* Scroll Indicator */}
          <div className="pt-16">
            <div className="flex flex-col items-center space-y-2 text-gray-500">
              <span className="text-sm font-mono">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
