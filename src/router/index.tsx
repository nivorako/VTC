// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Contact from '../pages/Contact'
import Services from '../pages/Services'
import Mentions from '../pages/Mentions'
import MainLayout from '../layout/MainLayout'

export const router = createBrowserRouter([
  {
    element: <MainLayout/>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/services',
        element: <Services />
      },
      {
        path: '/mentions',
        element: <Mentions />
      }
    ]
  }
])
