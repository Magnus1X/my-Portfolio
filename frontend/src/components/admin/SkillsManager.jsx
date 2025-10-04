import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { Plus, Edit, Trash2, Save, X, Code } from 'lucide-react'
import { skillsAPI } from '../../utils/api'
import { toast } from 'react-hot-toast'

const SkillsManager = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    svgIcon: '',
    category: 'Technical',
    order: 0
  })
  const [selectedTech, setSelectedTech] = useState(null)

  const categories = ['Technical', 'Frontend', 'Backend', 'Programming', 'Database', 'Soft']

  // Curated tech options using simplified SVGs.
  // Note: You can paste official brand SVG in the Custom SVG field for fidelity.
  const techOptions = [
    // Frontend
    { value: 'react', label: 'React', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><g fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="11" ry="4"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(120 12 12)"/></g></svg>' },
    { value: 'nextjs', label: 'Next.js', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h2v10h-2V7zm-5 4l7 7H13l-7-7h2z"/></svg>' },
    { value: 'vue', label: 'Vue.js', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l10 18H2L12 3zm0 4.5L6 18h12L12 7.5z"/></svg>' },
    { value: 'angular', label: 'Angular', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l10 4-2 12-8 4-8-4L2 6l10-4zm0 4.5l-5.5 2 .9 5.1L12 16.5l4.6-2.9.9-5.1L12 6.5z"/></svg>' },
    { value: 'svelte', label: 'Svelte', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm-2 5h4l2 3-2 3h-4l-2-3 2-3z"/></svg>' },
    { value: 'html5', label: 'HTML5', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18l-2 18-7 2-7-2L3 3zm5 14l4 1 4-1 .8-9H6.2L8 17z"/></svg>' },
    { value: 'css3', label: 'CSS3', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18l-2 18-7 2-7-2L3 3zm5 14l4 1 4-1 .7-7H8.3l-.3 2h8l-.3 3H8.4l-.4 2z"/></svg>' },
    { value: 'tailwind', label: 'Tailwind CSS', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10c1.5-3 4-3 5-3s2.5 1 3 2c.5 1 1.5 2 3 2-1.5 3-4 3-5 3s-2.5-1-3-2c-.5-1-1.5-2-3-2zM3 14c1.5-3 4-3 5-3s2.5 1 3 2c.5 1 1.5 2 3 2-1.5 3-4 3-5 3s-2.5-1-3-2c-.5-1-1.5-2-3-2z"/></svg>' },
    { value: 'bootstrap', label: 'Bootstrap', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="4"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="#fff">B</text></svg>' },
    { value: 'materialui', label: 'Material UI', category: 'Frontend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 8l8 5 8-5v8l-8 5-8-5V8z"/></svg>' },

    // Backend
    { value: 'node', label: 'Node.js', category: 'Backend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 3.5L6 9v6l6 3.5 6-3.5V9l-6-3.5z"/></svg>' },
    { value: 'express', label: 'Express', category: 'Backend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/></svg>' },
    { value: 'nestjs', label: 'NestJS', category: 'Backend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l6 4v8l-6 4-6-4V8l6-4zm0 3l-3 2v6l3 2 3-2V9l-3-2z"/></svg>' },
    { value: 'prisma', label: 'Prisma', category: 'Backend', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3l10 5-4 13-10-5 4-13z"/></svg>' },

    // Programming
    { value: 'javascript', label: 'JavaScript', category: 'Programming', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h2v8H8zm6 0h2v5a3 3 0 11-6 0h2a1 1 0 102 0V8z"/></svg>' },
    { value: 'typescript', label: 'TypeScript', category: 'Programming', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M6 8h12v2H14v8h-2v-8H6V8z"/></svg>' },
    { value: 'python', label: 'Python', category: 'Programming', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c2.8 0 5 2.2 5 5v2H7V8c0-2.8 2.2-5 5-5zm-5 8h10v5c0 2.8-2.2 5-5 5s-5-2.2-5-5v-5z"/></svg>' },
    { value: 'java', label: 'Java', category: 'Programming', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 19c4-1 8-3 8-6s-4-5-8-6c3 2 6 3 6 6s-3 4-6 6z"/></svg>' },
    { value: 'cpp', label: 'C++', category: 'Programming', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l10 6v8l-10 6L2 16V8l10-6zm-2 9H8v2h2v2h2v-2h2v-2h-2V9h-2v2z"/></svg>' },

    // Database
    { value: 'mongodb', label: 'MongoDB', category: 'Database', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s3 4 3 10-3 10-3 10-3-4-3-10S12 2 12 2z"/></svg>' },
    { value: 'postgresql', label: 'PostgreSQL', category: 'Database', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 8c0-3 3-5 6-5s6 2 6 5-3 5-6 5-6-2-6-5zm0 8c0-2 3-3 6-3s6 1 6 3-3 3-6 3-6-1-6-3z"/></svg>' },
    { value: 'mysql', label: 'MySQL', category: 'Database', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 7c0-2 3-3 7-3s7 1 7 3-3 3-7 3-7-1-7-3zm0 5c0-2 3-3 7-3s7 1 7 3-3 3-7 3-7-1-7-3zm0 5c0-2 3-3 7-3s7 1 7 3-3 3-7 3-7-1-7-3z"/></svg>' },
    { value: 'sqlite', label: 'SQLite', category: 'Database', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="5" width="16" height="14" rx="2"/></svg>' },
    { value: 'mariadb', label: 'MariaDB', category: 'Database', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17c3-4 9-4 12-2s6 2 6 2-3 3-9 3-9-3-9-3z"/></svg>' },
    { value: 'redis', label: 'Redis', category: 'Database', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>' },

    // Tools
    { value: 'git', label: 'Git', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 9-9 9-9-9 9-9zm1 6a2 2 0 110 4 2 2 0 010-4zm-4 6a2 2 0 114 0 2 2 0 01-4 0z"/></svg>' },
    { value: 'docker', label: 'Docker', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="10" width="18" height="8" rx="2"/><path d="M7 7h3v3H7zm4 0h3v3h-3zm4 0h3v3h-3z"/></svg>' },
    { value: 'graphql', label: 'GraphQL', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 21,7 21,17 12,22 3,17 3,7"/></svg>' },
    { value: 'rest', label: 'REST API', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 7h16v4H4zm0 6h10v4H4z"/></svg>' },
    { value: 'postman', label: 'Postman', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/></svg>' },
    { value: 'aws', label: 'AWS', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 5-9 5-9-5 9-5zm0 10l9 5-9 5-9-5 9-5z"/></svg>' },
    { value: 'firebase', label: 'Firebase', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 20l12-4-8-12-4 16z"/></svg>' },
    { value: 'vite', label: 'Vite', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l6 6-6 14-6-14 6-6z"/></svg>' },
    { value: 'webpack', label: 'Webpack', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 21,8 21,16 12,22 3,16 3,8"/></svg>' },
    { value: 'babel', label: 'Babel', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17l9-12 9 12-9 5-9-5z"/></svg>' },
    { value: 'nginx', label: 'Nginx', category: 'Technical', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,12 12,22 2,12"/></svg>' },
  ]

  const toSVG = (svgInner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">${svgInner}</svg>`

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll()
      setSkills(response.data)
    } catch (error) {
      console.error('Error fetching skills:', error)
      toast.error('Failed to fetch skills')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTechSelect = (option) => {
    setSelectedTech(option)
    setFormData(prev => ({
      ...prev,
      name: option?.label || '',
      svgIcon: option ? option.svg : '',
      // Default category from option; can be overridden via category select
      category: option?.category || prev.category,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Skill name is required')
      return
    }

    // Ensure SVG markup is present; if only fragments are provided, wrap them.
    const ensureWrappedSVG = (svg) => {
      if (!svg || !svg.trim()) return getDefaultSVG(formData.category)
      const s = svg.trim()
      if (s.startsWith('<svg')) return s
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">${s}</svg>`
    }
    formData.svgIcon = ensureWrappedSVG(formData.svgIcon)

    try {
      if (editingSkill) {
        await skillsAPI.update(editingSkill.id, formData)
        toast.success('Skill updated successfully!')
      } else {
        await skillsAPI.create(formData)
        toast.success('Skill created successfully!')
      }
      
      fetchSkills()
      resetForm()
    } catch (error) {
      console.error('Error saving skill:', error)
      toast.error('Failed to save skill')
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      svgIcon: skill.svgIcon,
      category: skill.category,
      order: skill.order
    })
    const match = techOptions.find(o => o.label === skill.name)
    setSelectedTech(match || null)
    setShowForm(true)
  }

  const handleDelete = async (skillId) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      await skillsAPI.delete(skillId)
      toast.success('Skill deleted successfully!')
      fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('Failed to delete skill')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      svgIcon: '',
      category: 'Technical',
      order: 0
    })
    setSelectedTech(null)
    setEditingSkill(null)
    setShowForm(false)
  }

  const getDefaultSVG = (category) => {
    const defaultSVGs = {
      'Technical': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      'Frontend': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      'Backend': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
      'Programming': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      'Database': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      'Soft': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
    }
    return defaultSVGs[category] || defaultSVGs['Technical']
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading skills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Skills Management</h2>
          <p className="text-gray-400">Manage your technical skills and proficiencies</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Select Technology *
                </label>
                <Select
                  options={techOptions}
                  value={selectedTech}
                  onChange={handleTechSelect}
                  placeholder="Search and select tech (e.g., React, Node.js)"
                  isClearable
                  isSearchable
                  maxMenuHeight={260}
                  menuPlacement="auto"
                  menuPosition="fixed"
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                  menuShouldScrollIntoView={false}
                  closeMenuOnScroll={false}
                  menuShouldBlockScroll={true}
                  onMenuOpen={() => {
                    if (typeof document !== 'undefined') {
                      document.body.style.overflow = 'hidden'
                    }
                  }}
                  onMenuClose={() => {
                    if (typeof document !== 'undefined') {
                      document.body.style.overflow = ''
                    }
                  }}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, backgroundColor: '#111827', color: '#fff', overflow: 'hidden' }),
                    menuList: (base) => ({ ...base, maxHeight: 240, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }),
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: '#1f2937',
                      borderColor: state.isFocused ? '#22d3ee' : '#374151',
                      boxShadow: state.isFocused ? '0 0 0 1px #22d3ee' : 'none',
                      ':hover': { borderColor: '#22d3ee' },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#374151' : state.isSelected ? '#22d3ee' : 'transparent',
                      color: state.isSelected ? '#0f172a' : '#fff',
                    }),
                    singleValue: (base) => ({ ...base, color: '#fff' }),
                    input: (base) => ({ ...base, color: '#fff' }),
                    placeholder: (base) => ({ ...base, color: '#9ca3af' }),
                  }}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manual Name entry for custom technologies */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Technology Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                placeholder="e.g., React, Node.js, Prisma"
              />
              <p className="mt-2 text-sm text-gray-400">If not selecting from the dropdown, enter a name here.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Selected Icon Preview
              </label>
              <div className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center space-x-3">
                <div
                  className="w-8 h-8 text-accent-500"
                  dangerouslySetInnerHTML={{ __html: formData.svgIcon || getDefaultSVG(formData.category) }}
                />
                <span className="text-gray-300 text-sm">{formData.name || 'No tech selected'}</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Icons are auto-filled when selecting from the dropdown. You can also paste a custom SVG below.
              </p>
            </div>

            {/* Custom SVG input */}
            <div>
              <label htmlFor="svgIcon" className="block text-sm font-medium text-white mb-2">
                Custom SVG Logo (optional)
              </label>
              <textarea
                id="svgIcon"
                name="svgIcon"
                value={formData.svgIcon}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300 font-mono text-sm"
                rows={6}
                placeholder="Paste full <svg>...</svg> markup. If you paste only paths, they will be wrapped automatically."
              />
              <p className="mt-2 text-sm text-gray-400">Tip: Use original brand SVG for best visual fidelity.</p>
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-white mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                placeholder="0"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{editingSkill ? 'Update' : 'Create'} Skill</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-6">
        {Object.entries(
          skills.reduce((acc, skill) => {
            const category = skill.category || 'Technical'
            if (!acc[category]) acc[category] = []
            acc[category].push(skill)
            return acc
          }, {})
        ).map(([category, categorySkills]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Code size={20} className="text-accent-500" />
              <span>{category}</span>
              <span className="text-sm text-gray-400">({categorySkills.length})</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-8 h-8 text-accent-500"
                      dangerouslySetInnerHTML={{ __html: skill.svgIcon }}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-gray-400 hover:text-accent-500 transition-colors duration-300"
                        aria-label="Edit skill"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                        aria-label="Delete skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="text-white font-medium mb-1">{skill.name}</h4>
                  <p className="text-sm text-gray-400">Order: {skill.order}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code size={48} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Skills Added</h3>
          <p className="text-gray-400 mb-6">Start building your skills showcase by adding your first skill.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Add Your First Skill</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default SkillsManager
