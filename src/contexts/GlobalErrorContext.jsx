'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

const GlobalErrorContext = createContext()

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext)
  if (!context) {
    throw new Error('useGlobalError must be used within a GlobalErrorProvider')
  }
  return context
}

export default function GlobalErrorProvider({ children }) {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const showError = useCallback((errorMessage, errorDetails = null) => {
    console.error('Global Error:', errorMessage, errorDetails)
    setError({
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const setLoading = useCallback((loading) => {
    setIsLoading(loading)
  }, [])

  const value = {
    error,
    isLoading,
    showError,
    clearError,
    setLoading
  }

  return (
    <GlobalErrorContext.Provider value={value}>
      {children}
    </GlobalErrorContext.Provider>
  )
}
