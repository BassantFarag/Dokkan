import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthProvider>
       <App />
       <Toaster position='top-right' richColors  closeButton/>
     </AuthProvider>
  </StrictMode>
)
