import React, { useState, useEffect } from 'react'
import { Save, Upload, Download, User, Mail, MapPin, Link, Image as ImageIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { userAPI, uploadAPI, getFileUrl } from '../../utils/api'
import { toast } from 'react-hot-toast'

const ProfileManager = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingCV, setUploadingCV] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm()

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await userAPI.get()
      const data = response.data
      setUserInfo(data)
      reset(data)
    } catch (error) {
      console.error('Error fetching user info:', error)
      toast.error('Failed to fetch profile information')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await userAPI.update(data)
      toast.success('Profile updated successfully!')
      fetchUserInfo() // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    setUploadingPhoto(true)
    try {
      const response = await uploadAPI.profilePhoto(file)
      toast.success('Profile photo updated successfully!')
      fetchUserInfo() // Refresh data
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Failed to upload profile photo')
    } finally {
      setUploadingPhoto(false)
      e.target.value = '' // Reset file input
    }
  }

  const handleCVUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }

    setUploadingCV(true)
    try {
      const response = await uploadAPI.cv(file)
      toast.success('CV updated successfully!')
      fetchUserInfo() // Refresh data
    } catch (error) {
      console.error('Error uploading CV:', error)
      toast.error('Failed to upload CV')
    } finally {
      setUploadingCV(false)
      e.target.value = '' // Reset file input
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile Management</h2>
        <p className="text-gray-400">Update your personal information and portfolio details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
              placeholder="Saurav Kumar"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
              placeholder="contact@sauravkumar.dev"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Tagline and Location */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-white mb-2">
              Professional Tagline
            </label>
            <input
              type="text"
              id="tagline"
              {...register('tagline')}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
              placeholder="Full Stack Developer & AI Engineer"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              {...register('location')}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
              placeholder="India"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-white mb-2">
            Professional Summary
          </label>
          <textarea
            id="summary"
            rows={4}
            {...register('summary')}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300 resize-none"
            placeholder="Passionate developer creating innovative solutions with modern technologies..."
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Social Links</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-white mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin"
                {...register('linkedin')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                placeholder="https://linkedin.com/in/sauravkumar"
              />
            </div>

            <div>
              <label htmlFor="github" className="block text-sm font-medium text-white mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                id="github"
                {...register('github')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                placeholder="https://github.com/sauravkumar"
              />
            </div>

            <div>
              <label htmlFor="codeforces" className="block text-sm font-medium text-white mb-2">
                Codeforces ID
              </label>
              <input
                type="text"
                id="codeforces"
                {...register('codeforces')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                placeholder="e.g., saurav_xyz (leave blank to hide)"
              />
            </div>

            <div>
              <label htmlFor="leetcode" className="block text-sm font-medium text-white mb-2">
                LeetCode ID
              </label>
              <input
                type="text"
                id="leetcode"
                {...register('leetcode')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-colors duration-300"
                placeholder="e.g., sauravxyz (leave blank to hide)"
              />
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">File Uploads</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Profile Photo
              </label>
              <div className="space-y-4">
                {userInfo?.profilePhoto && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={getFileUrl(userInfo.profilePhoto)}
                      alt="Current profile photo"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
                    />
                    <div>
                      <p className="text-sm text-gray-400">Current photo</p>
                      <a
                        href={getFileUrl(userInfo.profilePhoto)}
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
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer transition-colors duration-300 hover:border-accent-500 hover:bg-accent-500/10 ${
                      uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ImageIcon size={20} className="text-gray-400" />
                    <span className="text-gray-400">
                      {uploadingPhoto ? 'Uploading...' : 'Upload New Photo'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                CV/Resume
              </label>
              <div className="space-y-4">
                {userInfo?.cvUrl && (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Download size={24} className="text-accent-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Current CV</p>
                      <a
                        href={getFileUrl(userInfo.cvUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-500 hover:text-accent-400"
                      >
                        Download current CV
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCVUpload}
                    disabled={uploadingCV}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className={`flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer transition-colors duration-300 hover:border-accent-500 hover:bg-accent-500/10 ${
                      uploadingCV ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-gray-400">
                      {uploadingCV ? 'Uploading...' : 'Upload New CV (PDF)'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-800">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileManager
