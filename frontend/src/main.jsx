import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux";
import store from './store/index.js';
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  </GoogleOAuthProvider>
)
