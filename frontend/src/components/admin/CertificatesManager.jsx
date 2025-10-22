import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Calendar, Award, Image as ImageIcon } from 'lucide-react'
import { certificatesAPI, uploadAPI, getFileUrl } from '../../utils/api'
import { toast } from 'react-hot-toast'

const CertificatesManager = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    order: 0
  })

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await certificatesAPI.getAll()
      setCertificates(response.data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
      toast.error('Failed to fetch certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
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
      const response = await uploadAPI.certificateImage(file)
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
      toast.error('Certificate title is required')
      return
    }

    if (!formData.issuer.trim()) {
      toast.error('Issuer is required')
      return
    }

    if (!formData.issueDate.trim()) {
      toast.error('Issue date is required')
      return
    }

    try {
      if (editingCertificate) {
        await certificatesAPI.update(editingCertificate.id, formData)
        toast.success('Certificate updated successfully!')
      } else {
        await certificatesAPI.create(formData)
        toast.success('Certificate created successfully!')
      }

      fetchCertificates()
      resetForm()
    } catch (error) {
      console.error('Error saving certificate:', error)
      toast.error('Failed to save certificate')
    }
  }

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate)
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate?.slice(0, 10) || '',
      credentialId: certificate.credentialId || '',
      credentialUrl: certificate.credentialUrl || '',
      imageUrl: certificate.imageUrl || '',
      order: certificate.order || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (certificateId) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return

    try {
      await certificatesAPI.delete(certificateId)
      toast.success('Certificate deleted successfully!')
      fetchCertificates()
    } catch (error) {
      console.error('Error deleting certificate:', error)
      toast.error('Failed to delete certificate')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: '',
      imageUrl: '',
      order: 0
    })
    setEditingCertificate(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Certificates Management</h2>
          <p className="text-gray-400">Manage your achievements and certifications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  placeholder="AWS Certified Solutions Architect"
                  required
                />
              </div>

              <div>
                <label htmlFor="issuer" className="block text-sm font-medium text-white mb-2">
                  Issuer *
                </label>
                <input
                  type="text"
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  placeholder="Amazon Web Services"
                  required
                />
              </div>
            </div>

            {/* Issue Date and Credential */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-white mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="credentialId" className="block text-sm font-medium text-white mb-2">
                  Credential ID
                </label>
                <input
                  type="text"
                  id="credentialId"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  placeholder="ABC-12345"
                />
              </div>

              <div>
                <label htmlFor="credentialUrl" className="block text-sm font-medium text-white mb-2">
                  Credential URL
                </label>
                <input
                  type="url"
                  id="credentialUrl"
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                  placeholder="https://verify.example.com/certificate/ABC-12345"
                />
              </div>
            </div>

            {/* Certificate Image */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Certificate Image
              </label>
              <div className="space-y-4">
                {formData.imageUrl && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={getFileUrl(formData.imageUrl)}
                      alt="Certificate preview"
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
                    id="certificate-image-upload"
                  />
                  <label
                    htmlFor="certificate-image-upload"
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer transition-colors duration-300 hover:border-accent-500 hover:bg-accent-500/10 ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ImageIcon size={20} className="text-gray-400" />
                    <span className="text-gray-400">
                      {uploadingImage ? 'Uploading...' : 'Upload Certificate Image'}
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
                <span>{editingCertificate ? 'Update' : 'Create'} Certificate</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certificates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={48} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Certificates Added</h3>
          <p className="text-gray-400 mb-6">Showcase your achievements by adding your first certificate.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Add Your First Certificate</span>
          </button>
        </div>
      )}
    </div>
  )
}

const CertificateCard = ({ certificate, onEdit, onDelete }) => {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{certificate.title}</h4>
          <p className="text-gray-400 text-sm">{certificate.issuer}</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(certificate)}
            className="text-gray-400 hover:text-accent-500 transition-colors duration-300"
            aria-label="Edit certificate"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(certificate.id)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-300"
            aria-label="Delete certificate"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {certificate.imageUrl && (
        <div className="mb-3">
          <img
            src={getFileUrl(certificate.imageUrl)}
            alt={certificate.title}
            className="w-full h-32 object-cover rounded-lg border border-gray-700"
          />
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'No date'}
        </span>
        {certificate.credentialUrl && (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-500 hover:text-accent-400 transition-colors duration-300"
          >
            Verify
          </a>
        )}
      </div>
    </div>
  )
}

export default CertificatesManager
