import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
const clerkPublicKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
createRoot(document.getElementById('root')).render(
   <ClerkProvider publishableKey={clerkPublicKey}>
     <App />
   </ClerkProvider>
  
  
)
