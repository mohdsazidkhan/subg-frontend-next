import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Head from 'next/head';
import store from '../store';
import { GlobalErrorProvider } from '../contexts/GlobalErrorContext';
import MobileBottomNavigation from '../components/MobileBottomNavigation';
import AdminMobileBottomNavigation from '../components/AdminMobileBottomNavigation';
import { useRouter } from 'next/router';
import { isAdmin } from '../lib/utils/adminUtils';
import { hasAdminPrivileges } from '../lib/utils/adminUtils';
import Sidebar from '../components/Sidebar';
import ClientOnly from '../components/ClientOnly';
import '../styles/index.css';
import '../styles/App.css';
import '../styles/darkMode.css';
import '../styles/mobile-app.css';
import '../styles/responsive.css';

// App Layout Component that can use router
function AppLayout({ Component, pageProps }) {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Sidebar only for admin users */}
      <ClientOnly>
        {isAdmin() && hasAdminPrivileges() && <Sidebar />}
      </ClientOnly>
      
      <div className={`appContainer ${router.pathname !== '/' ? 'has-navbar' : ''}`}>
        <Component {...pageProps} />
      </div>
      
      {/* Admin Mobile Bottom Navigation shows only on admin pages */}
      <ClientOnly>
        {router.pathname.startsWith('/admin') && <AdminMobileBottomNavigation />}
      </ClientOnly>
      
      {/* User Mobile Bottom Navigation shows on all non-admin pages */}
      <ClientOnly>
        {!router.pathname.startsWith('/admin') && <MobileBottomNavigation />}
      </ClientOnly>
    </>
  );
}

export default function App({ Component, pageProps }) {
  // Get Google Client ID from environment variables
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  // If no Google Client ID is provided, wrap without GoogleOAuthProvider
  if (!googleClientId || googleClientId === 'your_google_client_id_here') {
    console.warn('Google OAuth Client ID not configured. Google login will not work.');
    return (
      <Provider store={store}>
        <GlobalErrorProvider>
          <AppLayout Component={Component} pageProps={pageProps} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
              error: {
                duration: 5000,
                theme: {
                  primary: 'red',
                  secondary: 'black',
                },
              },
            }}
          />
        </GlobalErrorProvider>
      </Provider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <GlobalErrorProvider>
          <AppLayout Component={Component} pageProps={pageProps} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
              error: {
                duration: 5000,
                theme: {
                  primary: 'red',
                  secondary: 'black',
                },
              },
            }}
          />
        </GlobalErrorProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}
