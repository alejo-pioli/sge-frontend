import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [alumnos, setAlumnos] = useState([])

  function getAlumnos() {
    axios.get("http://localhost:3000/api/alumnos")
      .then((data) => {
        console.log(data.data)
        setAlumnos(data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getAlumnos()
  }, [])

  return (
    <>
      <h1>Alumnos</h1>
      {alumnos.length === 0 ? <></> :
        alumnos.map((alumno) => {
          return <li>{alumno.name} {alumno.surname}</li>
        })}
    </>
  )
}

export default App
