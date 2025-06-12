import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap'

function App() {
  const [alumnos, setAlumnos] = useState([])

  function getAlumnos(materia) {
    const url = "http://localhost:3000/api/alumnos"
    let params
    
    if (materia) {
      params = `?materia=${materia}`
    } else {
      params = ""
    }

    axios.get(url + params, {headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }})
      .then((data) => {
        console.log(data.data)
        setAlumnos(data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    getAlumnos(null)
  }, [])

  return (
    <>
      <h1>Alumnos</h1>
      <form>
        <input type="text"></input>
        <Button variant="primary">Buscar</Button>
      </form>
      {alumnos.length === 0 ? <></> :
        alumnos.map((alumno) => {
          return <li>{alumno.name} {alumno.surname}</li>
        })}
    </>
  )
}

export default App
