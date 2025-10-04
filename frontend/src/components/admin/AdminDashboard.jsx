import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Code, Briefcase, Award, Mail, Eye } from 'lucide-react'
import { authAPI } from '../../utils/api'
import { toast } from 'react-hot-toast'

// Import admin components
import ProfileManager from './ProfileManager'
import SkillsManager from './SkillsManager'
import ProjectsManager from './ProjectsManager'
import CertificatesManager from './CertificatesManager'
import MessagesManager from './MessagesManager'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'messages', label: 'Messages', icon: Mail },
  ]

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await authAPI.verify()
        setLoading(false)
      } catch (error) {
        localStorage.removeItem('admin_token')
        navigate('/admin')
      }
    }

    verifyAuth()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    toast.success('Logged out successfully')
    navigate('/admin')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManager />
      case 'skills':
        return <SkillsManager />
      case 'projects':
        return <ProjectsManager />
      case 'certificates':
        return <CertificatesManager />
      case 'messages':
        return <MessagesManager />
      default:
        return <ProfileManager />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">SK</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Portfolio Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Eye size={18} />
                <span className="text-sm">View Portfolio</span>
              </a>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-accent-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
