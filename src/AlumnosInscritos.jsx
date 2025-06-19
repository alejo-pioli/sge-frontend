import { Table } from "react-bootstrap"
import { useLoginInfo } from "./lib/LoginContext"
import { getMateria, getAlumnosInscriptos, useAPI } from "./lib/api"
import { useParams } from "react-router-dom"
import { careerToString } from "./DatosPersonales.jsx"
import { Link } from "react-router-dom"

export default function AlumnosInscritos() {
    const [login] = useLoginInfo()
    const { id } = useParams()

    const materia = useAPI(getMateria, id) ?? { name: "" }
    const alumnos = useAPI(getAlumnosInscriptos, id) ?? []

    return (
        <>
            <h1>Alumnos inscritos a <Link to={`/materias/${id}`}>{materia.name}</Link></h1>
            <Table>
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Carrera</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map((c) => (
                        <tr>
                            <td>
                                {c.dni}
                            </td>
                            <td>
                                {c.name}
                            </td>
                            <td>
                                {c.surname}
                            </td>
                            <td>
                                {careerToString(c.career)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}