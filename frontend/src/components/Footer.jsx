import React, { useEffect, useState } from 'react'
import { Github, Linkedin, Mail, Heart, Code, Code2, Trophy } from 'lucide-react'
import { userAPI } from '../utils/api'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.get()
        setUserInfo(response.data)
      } catch (error) {
        console.error('Error fetching user info in footer:', error)
      }
    }
    fetchUserInfo()
  }, [])

  const socialLinks = (() => {
    const links = []
    if (userInfo?.github) links.push({ name: 'GitHub', url: userInfo.github, icon: Github })
    if (userInfo?.linkedin) links.push({ name: 'LinkedIn', url: userInfo.linkedin, icon: Linkedin })
    if (userInfo?.codeforces) links.push({ name: 'Codeforces', url: `https://codeforces.com/profile/${userInfo.codeforces}`, icon: Code2 })
    if (userInfo?.leetcode) links.push({ name: 'LeetCode', url: `https://leetcode.com/${userInfo.leetcode}/`, icon: Trophy })
    if (userInfo?.email) links.push({ name: 'Email', url: `mailto:${userInfo.email}`, icon: Mail })
    return links
  })()

  // Using hash link navigation handled globally in App.jsx

  return (
    <footer className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SK</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{userInfo?.name || 'Saurav Kumar'}</h3>
                <p className="text-gray-400 text-sm">{userInfo?.tagline || 'Full Stack Developer'}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Creating innovative solutions with modern technologies. 
              Passionate about building applications that make a difference.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <a 
                href="/#hero"
                className="text-gray-400 hover:text-accent-500 transition-colors duration-300 text-sm"
              >
                Home
              </a>
              <a 
                href="/#about"
                className="text-gray-400 hover:text-accent-500 transition-colors duration-300 text-sm"
              >
                About
              </a>
              <a 
                href="/#projects"
                className="text-gray-400 hover:text-accent-500 transition-colors duration-300 text-sm"
              >
                Projects
              </a>
              <a 
                href="/#contact"
                className="text-gray-400 hover:text-accent-500 transition-colors duration-300 text-sm"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect With Me</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-accent-500 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
            <div className="text-sm text-gray-400">
              <p>📧 {userInfo?.email || '95sauravkumar95@gmail.com'}</p>
              {/* <p>📍 Available for freelance work</p> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} Saurav Kumar. Made with</span>
              <Heart size={16} className="text-red-500 fill-current" />
              <span>and</span>
              <Code size={16} className="text-accent-500" />
              <span>in India</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a
                href="/#hero"
                className="text-gray-400 hover:text-accent-500 transition-colors duration-300 text-sm flex items-center space-x-2"
              >
                <span>Back to top</span>
                <div className="w-6 h-6 border border-current rounded-full flex items-center justify-center">
                  <span className="text-xs">↑</span>
                </div>
              </a>
              
              <a
                href="/admin"
                className="text-gray-500 hover:text-gray-400 transition-colors duration-300 text-xs font-mono"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
