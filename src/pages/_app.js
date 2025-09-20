import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from '../store';
import { GlobalErrorProvider } from '../contexts/GlobalErrorContext';
import '../styles/index.css';
import '../styles/App.css';
import '../styles/darkMode.css';
import '../styles/mobile-app.css';
import '../styles/responsive.css';

export default function App({ Component, pageProps }) {
  // Get Google Client ID from environment variables
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  // If no Google Client ID is provided, wrap without GoogleOAuthProvider
  if (!googleClientId || googleClientId === 'your_google_client_id_here') {
    console.warn('Google OAuth Client ID not configured. Google login will not work.');
    return (
      <Provider store={store}>
        <GlobalErrorProvider>
          <Component {...pageProps} />
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
          <Component {...pageProps} />
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
