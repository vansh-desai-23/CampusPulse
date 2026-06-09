import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const savedAuth =
    localStorage.getItem('campuspulseAuth') ||
    sessionStorage.getItem('campuspulseAuth')

  if (savedAuth) {
    try {
      const auth = JSON.parse(savedAuth)
      if (auth?.token) {
        config.headers.Authorization = `${auth.tokenType || 'Bearer'} ${auth.token}`
      }
    } catch {
      localStorage.removeItem('campuspulseAuth')
      sessionStorage.removeItem('campuspulseAuth')
    }
  }

  return config
})

export default api
