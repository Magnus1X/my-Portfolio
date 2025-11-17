import React, { useEffect, useState } from 'react'
import { Github, Linkedin, Mail, Heart, Code, Code2, Trophy, Coffee } from 'lucide-react'
import { userAPI } from '../utils/api'

// Custom SVG Icons
const LeetCodeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.036l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039z" />
    <path d="M20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z" />
  </svg>
)

const CodeforcesIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 3C8.36 3 5 6.36 5 10.5S8.36 18 12.5 18c1.83 0 3.5-.66 4.82-1.76L15 14.5c-.82.6-1.84.96-2.95.96-2.76 0-5-2.24-5-5s2.24-5 5-5c1.11 0 2.13.36 2.95.96L17.32 4.76C16 3.66 14.33 3 12.5 3z" />
    <path d="M19 6v5h3V9h-1V7h1V6h-3zm0 7v5h3v-2h-1v-1h1v-2h-3z" />
  </svg>
)

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
    if (userInfo?.leetcode) links.push({ name: 'LeetCode', url: `https://leetcode.com/${userInfo.leetcode}/`, icon: LeetCodeIcon })
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
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} Saurav Kumar Made with</span>
              <Coffee size={16} className="text-red-500 fill-current" />
              <span>and</span>
              <Code2 size={16} className="text-accent-500" />

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
