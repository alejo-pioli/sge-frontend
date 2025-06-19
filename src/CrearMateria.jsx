import { useEffect, useState } from "react"
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap"
import { getDocentes, postMateria, unauthorizedHandler, useAPI } from "./lib/api"
import { useLoginInfo } from "./lib/LoginContext"

export default function CrearMateria() {
    const [login, refresh] = useLoginInfo()

    const docentes = useAPI(getDocentes) ?? []

    const [docente, setDocente] = useState(login.role === "teacher" ? login.id.toString() : "0" ?? "0")

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!data.teacherID && login.role === "teacher"){
            data.teacherID = login.id
        }

        data.teacherID = parseInt(data.teacherID)
        data.duration = parseInt(data.duration)

        const datos = await postMateria(data).catch(unauthorizedHandler(refresh))
        console.log(datos)
        if(datos.ok){
            e.target.reset()
        }
    }

    return (
        <>
            <h1>Crear materia</h1>
            <Form autoComplete="off" onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Análisis Matemático I"
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="teacherID">
                            <Form.Label>Docente</Form.Label>
                            <Form.Select
                                name="teacherID"
                                value={docente}
                                onChange={(e) => setDocente(e.target.value)}
                                disabled={login.role === "teacher"}
                                required
                            >
                                <option disabled value="0">
                                    Seleccione docente…
                                </option>
                                {docentes.map(d => (
                                    <option key={d.id} value={d.id.toString()}>
                                        {d.name} {d.surname}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="career">
                            <Form.Label>Carrera</Form.Label>
                            <Form.Select
                                name="career"
                                defaultValue=""
                                required>
                                <option disabled value="">Seleccione carrera...</option>
                                <option value="Z">Básica</option>
                                <option value="A">Ingeniería en Sistemas de Información</option>
                                <option value="B">Ingeniería Química</option>
                                <option value="C">Ingeniería Electrónica</option>
                                <option value="D">Ingeniería Electromecánica</option>
                                <option value="E">Ingeniería Industrial</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="duration">
                            <Form.Label>Duración</Form.Label>
                            <Form.Select
                                name="duration"
                                defaultValue=""
                                required>
                                <option disabled value="">Seleccione duración...</option>
                                <option value="0">Anual</option>
                                <option value="1">Primer cuatrimestre</option>
                                <option value="2">Segundo cuatrimestre</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>


                <Form.Group className="mb-3" controlId="schedule">
                    <Form.Label>Horario</Form.Label>
                    <Form.Control
                        type="text"
                        name="schedule"
                        placeholder="Martes 17:00-19:00"
                        required />
                </Form.Group>


                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
        </>
    )
}