import { jwtDecode } from 'jwt-decode'

export const isTokenValid = () => {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    
    return decoded.exp > currentTime
  } catch (error) {
    console.error('Token validation error:', error)
    return false
  }
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const setToken = (token) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

export const getUserId = () => {
  if (typeof window === 'undefined') return null
  
  const token = getToken()
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    return decoded.userId
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export const getUserRole = () => {
  if (typeof window === 'undefined') return null
  
  const token = getToken()
  if (!token) return null

  try {
    const decoded = jwtDecode(token)
    return decoded.role
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export const isAdmin = () => {
  const role = getUserRole()
  return role === 'admin'
}

export const hasAdminPrivileges = () => {
  if (typeof window === 'undefined') return false
  
  const token = getToken()
  if (!token) return false

  try {
    const decoded = jwtDecode(token)
    return decoded.role === 'admin' && decoded.adminPrivileges === true
  } catch (error) {
    console.error('Error checking admin privileges:', error)
    return false
  }
}

export const isStudent = () => {
  const role = getUserRole()
  return role === 'student'
}

export const isAuthenticated = () => {
  return isTokenValid()
}

export const logout = () => {
  removeToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
