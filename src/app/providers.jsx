'use client'

import React from 'react'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from '@/lib/store'
import GlobalErrorProvider from '@/contexts/GlobalErrorContext'

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "your-google-client-id"}>
        <GlobalErrorProvider>
          {children}
        </GlobalErrorProvider>
      </GoogleOAuthProvider>
    </Provider>
  )
}
