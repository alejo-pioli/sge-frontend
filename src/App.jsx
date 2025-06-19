import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/materias")
  })

  return (
    <>
    </>
  )
}

export default App
