import { useLoginInfo } from "./lib/LoginContext"
import { useParams } from "react-router-dom"
import { useAPI, getCalificaciones, getMateria, getAlumnosInscriptos, putCalificacion, deleteCalificacion } from "./lib/api"
import { Link } from "react-router-dom"
import { Table, Form, Button } from "react-bootstrap"
import { useState } from "react"

export function CalificacionesDocentes() {
    const [login] = useLoginInfo()
    const { id } = useParams()

    const [editMode, setEditMode] = useState(false)

    const materia = useAPI(getMateria, id) ?? { name: "" }
    const alumnos = useAPI(getAlumnosInscriptos, id) ?? []
    let notas = useAPI(getCalificaciones, id) ?? []

    const [instance, setInstance] = useState("")

    const instancias = []
    notas.forEach((nota) => {
        if (!instancias.some(e => e === nota.instance)) {
            instancias.push(nota.instance)
        }
    })

    const show = () => {
        const instancia = document.getElementById("instancia").value
        alumnos.map((e) => {
            e.grade = ""
            notas.forEach(n => {
                if (n.studentID === e.id && n.instance === instancia) {
                    e.grade = n.grade
                    e.gradeID = n.id
                }
            })
        })
        setInstance(instancia)
        console.log(notas)
    }

    const edit = () => {
        const instancia = document.getElementById("instancia").value

        if (!instancia) {
            return
        }

        setEditMode(true)
    }

    const saveEdit = async () => {

        const instancia = document.getElementById("instancia").value
        const notaInputs = Array.from(document.getElementsByClassName("nota"))
        const values = notaInputs.map(i => { return { gradeID: i.id, grade: i.value } })

        values.forEach(async (val) => {
            const nota = notas.find(n => n.id == val.gradeID)
            console.log(nota)

            if (nota.grade == val.grade) {
                console.log("Es igual")
                return
            } else if (!val.grade) {
                console.log("Borrando " + nota.id)
                const datos = await deleteCalificacion(nota.id)
                console.log(datos)
                return
            }

            nota.grade = parseInt(val.grade)
            nota.id = parseInt(nota.id)
            const datos = await putCalificacion(nota)
            console.log(datos)
        })

        notas = await getCalificaciones(id)
        console.log(notas)
        setEditMode(false)
        show()
    }

    return (
        <>
            <h1>Calificaciones de <Link to={`/materias/${id}`}>{materia.name}</Link></h1>
            <div className="d-flex justify-content-end mb-1">
                <Button as={Link} to={`/cargar-calificaciones/${id}`}>
                    Crear nueva instancia
                </Button>
                {editMode ?
                    <Button onClick={saveEdit} className="ms-4">
                        Cargar
                    </Button> :
                    <Button onClick={edit} className="ms-4">
                        Editar
                    </Button>}
            </div>
            <Form.Group controlId="teacherID">
                <Form.Label>Instancia</Form.Label>
                <Form.Select onChange={show} id="instancia">
                    <option value="">
                        Seleccione instancia…
                    </option>
                    {instancias.map(d => (
                        <option value={d}>
                            {d}
                        </option>
                    ))}
                </Form.Select>
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
                            {editMode ?
                                <td>
                                    {c.grade ? <Form.Group>
                                        <Form.Control
                                            id={c.gradeID}
                                            defaultValue={c.grade}
                                            className="nota"
                                            type="number"
                                            min="1"
                                            max="10">
                                        </Form.Control>
                                    </Form.Group> : ""}
                                </td> :
                                <td className="grade" id={c.gradeID}>
                                    <strong>{c.grade}</strong>
                                </td>}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export function CalificacionesAlumnos() {
    const [login] = useLoginInfo()
    const { id } = useParams()

    const materia = useAPI(getMateria, id) ?? { name: "" }
    const notas = useAPI(getCalificaciones, id, login.id) ?? []
    console.log(notas)

    return (
        <>
            <h1>Calificaciones de <Link to={`/materias/${id}`}>{materia.name}</Link></h1>
            <Table>
                <thead>
                    <tr>
                        <th>Instancia</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    {notas.map((c) => (
                        <tr>
                            <td>
                                {c.instance}
                            </td>
                            <td>
                                {c.grade}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default function Calificaciones() {
    const [login] = useLoginInfo()

    if (login.role === "teacher") {
        return <CalificacionesDocentes />
    } else {
        return <CalificacionesAlumnos />
    }
}