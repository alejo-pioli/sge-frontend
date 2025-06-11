import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CrearAlumno from './CrearAlumno.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CrearDocente from './CrearDocente.jsx'

const router = createBrowserRouter([
  {path:"/", element:<App />},
  {path:"/crear-alumno", element:<CrearAlumno />},
  {path:"/crear-docente", element:<CrearDocente />},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
