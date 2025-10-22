import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, ExternalLink, Github, Eye, Image as ImageIcon } from 'lucide-react'
import { projectsAPI, uploadAPI, getFileUrl } from '../../utils/api'
import { toast } from 'react-hot-toast'

const ProjectsManager = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    techStack: '',
    featured: false,
    order: 0
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll()
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setUploadingImage(true)
    try {
      const response = await uploadAPI.projectImage(file)
      setFormData({
        ...formData,
        imageUrl: response.data.url
      })
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Project description is required')
      return
    }

    if (!formData.techStack.trim()) {
      toast.error('Tech stack is required')
      return
    }

    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.id, formData)
        toast.success('Project updated successfully!')
      } else {
        await projectsAPI.create(formData)
        toast.success('Project created successfully!')
      }
      
      fetchProjects()
      resetForm()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      techStack: project.techStack,
      featured: project.featured,
      order: project.order
    })
    setShowForm(true)
  }

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await projectsAPI.delete(projectId)
      toast.success('Project deleted successfully!')
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      techStack: '',
      featured: false,
      order: 0
    })
    setEditingProject(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Projects Management</h2>
          <p className="text-gray-400">Manage your portfolio projects and showcase your work</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  placeholder="E-Commerce Platform"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-accent-500 bg-gray-800 border-gray-700 rounded focus:ring-accent-500 focus:ring-2"
                  />
                  <span className="text-white font-medium">Featured Project</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300 resize-none"
                placeholder="A comprehensive description of your project, its features, and technologies used..."
                required
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label htmlFor="techStack" className="block text-sm font-medium text-white mb-2">
                Tech Stack *
              </label>
              <input
                type="text"
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                placeholder="React, Node.js, Express, MySQL, Stripe API"
                required
              />
              <p className="mt-2 text-sm text-gray-400">
                Separate technologies with commas (e.g., React, Node.js, Express)
              </p>
            </div>

            {/* URLs */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="liveUrl" className="block text-sm font-medium text-white mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  id="liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  placeholder="https://your-project.com"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-white mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  placeholder="https://github.com/username/project"
                />
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
            </div>

            {/* Project Image */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Project Image
              </label>
              <div className="space-y-4">
                {formData.imageUrl && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={getFileUrl(formData.imageUrl)}
                      alt="Project preview"
                      className="w-24 h-24 rounded-lg object-cover border-2 border-gray-700"
                    />
                    <div>
                      <p className="text-sm text-gray-400">Current image</p>
                      <a
                        href={getFileUrl(formData.imageUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-500 hover:text-accent-400"
                      >
                        View full size
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer transition-colors duration-300 hover:border-accent-500 hover:bg-accent-500/10 ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ImageIcon size={20} className="text-gray-400" />
                    <span className="text-gray-400">
                      {uploadingImage ? 'Uploading...' : 'Upload Project Image'}
                    </span>
                  </label>
                </div>
              </div>
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
                <span>{editingProject ? 'Update' : 'Create'} Project</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-6">
        {/* Featured Projects */}
        {projects.filter(p => p.featured).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>⭐</span>
              <span>Featured Projects</span>
              <span className="text-sm text-gray-400">({projects.filter(p => p.featured).length})</span>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.filter(p => p.featured).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {projects.filter(p => !p.featured).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>💼</span>
              <span>Other Projects</span>
              <span className="text-sm text-gray-400">({projects.filter(p => !p.featured).length})</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => !p.featured).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink size={48} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Added</h3>
          <p className="text-gray-400 mb-6">Start building your portfolio by adding your first project.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Add Your First Project</span>
          </button>
        </div>
      )}
    </div>
  )
}

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{project.title}</h4>
          {project.featured && (
            <span className="inline-block px-2 py-1 bg-accent-500/20 text-accent-500 text-xs rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(project)}
            className="text-gray-400 hover:text-accent-500 transition-colors duration-300"
            aria-label="Edit project"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-300"
            aria-label="Delete project"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {project.imageUrl && (
        <div className="mb-3">
          <img
            src={getFileUrl(project.imageUrl)}
            alt={project.title}
            className="w-full h-32 object-cover rounded-lg border border-gray-700"
          />
        </div>
      )}
      
      <p className="text-gray-400 text-sm mb-3 line-clamp-3">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {project.techStack?.split(',').map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-700"
          >
            {tech.trim()}
          </span>
        ))}
      </div>
      
      <div className="flex items-center space-x-4 text-sm">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-accent-500 hover:text-accent-400 transition-colors duration-300"
          >
            <ExternalLink size={14} />
            <span>Live</span>
          </a>
        )}
        
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <Github size={14} />
            <span>Code</span>
          </a>
        )}
        
        <span className="text-gray-500">Order: {project.order}</span>
      </div>
    </div>
  )
}

export default ProjectsManager
