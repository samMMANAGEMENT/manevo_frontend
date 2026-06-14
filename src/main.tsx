import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router.tsx'
import './index.css'

import { AuthProvider } from './shared/providers/AuthProvider.tsx'
import ManevoPreloader from './shared/components/ui/Preload.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ManevoPreloader global />
    </AuthProvider>
  </StrictMode>,
)
