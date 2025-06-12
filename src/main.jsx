import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Alumnos from './Alumnos.jsx'
import CrearAlumno from './CrearAlumno.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CrearDocente from './CrearDocente.jsx'
import RootLayout from './RootLayout.jsx'
import './style/index.css'
import Login from './Login.jsx'

const router = createBrowserRouter([
  {
    path: "/", element: <RootLayout />, children: [
      { path: "/", element: <App /> },
      { path: "/crear-alumno", element: <CrearAlumno /> },
      { path: "/crear-docente", element: <CrearDocente /> },
    ]
  },
        { path: "login", element: <Login /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
