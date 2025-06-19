import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import CrearAlumno from './CrearAlumno.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CrearDocente from './CrearDocente.jsx'
import RootLayout from './RootLayout.jsx'
import './style/index.css'
import CrearMateria from './CrearMateria.jsx'
import InscripcionAMateria from './InscripcionAMateria.jsx'
import Materias from './Materias.jsx'
import Materia from './Materia.jsx'
import { LoginProvider } from './lib/LoginContext.jsx'
import { ToastContainer } from 'react-toastify'
import DatosPersonales from './DatosPersonales.jsx'
import Inasistencias from './Inasistencias.jsx'
import AlumnosInscritos from './AlumnosInscritos.jsx'

const router = createBrowserRouter([
  {
    path: "/", element: <RootLayout />, children: [
      { path: "/", element: <App /> },
      { path: "/materias", element: <Materias /> },
      { path: "/materias/:id", element: <Materia /> },
      { path: "/inasistencias/:id", element: <Inasistencias /> },
      { path: "/crear-alumno", element: <CrearAlumno /> },
      { path: "/crear-docente", element: <CrearDocente /> },
      { path: "/crear-materia", element: <CrearMateria /> },
      { path: "/inscripcion", element: <InscripcionAMateria /> },
      { path: "/perfil", element: <DatosPersonales /> },
      { path: "/alumnos/:id", element: <AlumnosInscritos /> }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
    <ToastContainer draggable={false} />
  </StrictMode>
)
