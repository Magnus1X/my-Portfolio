import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '')

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
}

// User API
export const userAPI = {
  get: () => api.get('/userinfo'),
  update: (data) => api.put('/userinfo', data),
}

// Skills API
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
}

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

// Certificates API
export const certificatesAPI = {
  getAll: () => api.get('/certificates'),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
}

// Contact API
export const contactAPI = {
  send: (data) => api.post('/contact', data),
}

// Messages API (admin)
export const messagesAPI = {
  getAll: () => api.get('/messages'),
  markRead: (id, data) => api.patch(`/messages/${id}/read`, data),
  reply: (id, data) => api.post(`/messages/${id}/reply`, data),
}

// Upload API
export const uploadAPI = {
  profilePhoto: (file) => {
    const formData = new FormData()
    formData.append('photo', file)
    return api.post('/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  cv: (file) => {
    const formData = new FormData()
    formData.append('cv', file)
    return api.post('/upload/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  projectImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/upload/project-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  certificateImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/upload/certificate-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// Helper to convert relative file URLs (e.g. /uploads/xyz.pdf) to absolute
export const getFileUrl = (url) => {
  if (!url) return url
  if (url.startsWith('/uploads')) return `${API_ORIGIN}${url}`
  return url
}

export default api
