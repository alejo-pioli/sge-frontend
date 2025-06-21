import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { useLoginInfo } from "./lib/LoginContext"
import { useAPI, getMateria, getAlumnosInscriptos, postCalificacion, getCalificaciones, unauthorizedHandler } from "./lib/api"
import { Button, Form, Table } from "react-bootstrap"
import { useCallback, useState } from "react"

export default function CargarCalificaciones() {
    const [login] = useLoginInfo()
    const { id } = useParams()
    const navigate = useNavigate()

    const materia = useAPI(getMateria, id) ?? { name: "" }
    const alumnos = useAPI(getAlumnosInscriptos, id) ?? []

    const subir = async () => {
        const instancia = document.getElementById("instancia").value
        const notaInputs = Array.from(document.getElementsByClassName("nota"));
        const values = notaInputs.map(i => { return { studentID: i.id, grade: i.value } });

        values.forEach(async (val) => {
            const datos = await postCalificacion(parseInt(id), parseInt(val.studentID), instancia, parseInt(val.grade))
            console.log(datos)
        })

        navigate("/calificaciones/" + id)
    }

    return (
        <>
            <h1>Cargar calificación de <Link to={`/materias/${id}`}>{materia.name}</Link></h1>

            <Form.Group className="pt-3">
                <Form.Label><strong><h3 className="m-0">Instancia Evaluativa</h3></strong></Form.Label>
                <Form.Control
                    id="instancia"
                    type="text"
                    placeholder="Parcial"
                    required>
                </Form.Control>
            </Form.Group>
            <Table className="mt-2">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody className="align-middle">
                    {alumnos.map((c) => (
                        <tr className="alumno">
                            <td>
                                {c.name}
                            </td>
                            <td>
                                {c.surname}
                            </td>
                            <td>
                                {c.dni}
                            </td>
                            <td>
                                <Form.Group>
                                    <Form.Control
                                        id={c.id}
                                        className="nota"
                                        type="number"
                                        min="1"
                                        max="10">
                                    </Form.Control>
                                </Form.Group>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={subir}>Cargar</Button>
        </>
    )
}