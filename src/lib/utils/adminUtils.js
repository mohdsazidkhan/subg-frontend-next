import { isAdmin, hasAdminPrivileges } from './authUtils'

export { isAdmin, hasAdminPrivileges }

export const canManageUsers = () => {
  return isAdmin() && hasAdminPrivileges()
}

export const canManageContent = () => {
  return isAdmin() && hasAdminPrivileges()
}

export const canViewAnalytics = () => {
  return isAdmin() && hasAdminPrivileges()
}

export const canManageSubscriptions = () => {
  return isAdmin() && hasAdminPrivileges()
}

export const canManagePayments = () => {
  return isAdmin() && hasAdminPrivileges()
}

export const canManageArticles = () => {
  return isAdmin() && hasAdminPrivileges()
}

export const getAdminPermissions = () => {
  if (!isAdmin() || !hasAdminPrivileges()) {
    return {
      users: false,
      content: false,
      analytics: false,
      subscriptions: false,
      payments: false,
      articles: false
    }
  }

  return {
    users: true,
    content: true,
    analytics: true,
    subscriptions: true,
    payments: true,
    articles: true
  }
}
