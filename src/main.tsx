import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { theme } from './styles/theme'
import { ThemeProvider } from 'styled-components'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
