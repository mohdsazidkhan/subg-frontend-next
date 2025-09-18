import { getToken } from './authUtils'

export const hasActiveSubscription = () => {
  if (typeof window === 'undefined') return false
  
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return false
  
  try {
    const user = JSON.parse(userInfo)
    return user.subscriptionStatus === 'active'
  } catch (error) {
    console.error('Error parsing user info:', error)
    return false
  }
}

export const getSubscriptionPlan = () => {
  if (typeof window === 'undefined') return null
  
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return null
  
  try {
    const user = JSON.parse(userInfo)
    return user.subscriptionPlan || 'FREE'
  } catch (error) {
    console.error('Error parsing user info:', error)
    return 'FREE'
  }
}

export const getSubscriptionExpiry = () => {
  if (typeof window === 'undefined') return null
  
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return null
  
  try {
    const user = JSON.parse(userInfo)
    return user.subscriptionExpiry
  } catch (error) {
    console.error('Error parsing user info:', error)
    return null
  }
}

export const isSubscriptionExpiring = (daysThreshold = 7) => {
  const expiry = getSubscriptionExpiry()
  if (!expiry) return false
  
  const expiryDate = new Date(expiry)
  const now = new Date()
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= daysThreshold && diffDays > 0
}

export const getSubscriptionStatus = () => {
  if (typeof window === 'undefined') return 'inactive'
  
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) return 'inactive'
  
  try {
    const user = JSON.parse(userInfo)
    return user.subscriptionStatus || 'inactive'
  } catch (error) {
    console.error('Error parsing user info:', error)
    return 'inactive'
  }
}

export const canAccessLevel = (level) => {
  const plan = getSubscriptionPlan()
  const isActive = hasActiveSubscription()
  
  if (!isActive) {
    // Free users can only access levels 0-3
    return level <= 3
  }
  
  switch (plan) {
    case 'FREE':
      return level <= 3
    case 'BASIC':
      return level <= 6
    case 'PREMIUM':
      return level <= 9
    case 'PRO':
      return true
    default:
      return level <= 3
  }
}

export const getMaxLevelForPlan = (plan) => {
  switch (plan) {
    case 'FREE':
      return 3
    case 'BASIC':
      return 6
    case 'PREMIUM':
      return 9
    case 'PRO':
      return 10
    default:
      return 3
  }
}
