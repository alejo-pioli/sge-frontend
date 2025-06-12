import axios from "axios"
import { useEffect, useState } from "react"
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap"

export default function CrearMateria() {

    const [docentes, setDocentes] = useState([])
    const [docentesMostrar, setDocentesMostrar] = useState([])
    const [index, setIndex] = useState(0)
    const [pages, setPages] = useState(0)

    const handleSubmit = async(e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post("http://localhost:3000/api/materias", data);
            console.log('Success:', response.data);
            e.target.reset()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const getDocentes = () => {
        axios.get("http://localhost:3000/api/docentes", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((data) => {
                console.log(data.data)
                setDocentes(data.data)
                setDocentesMostrar(data.data.slice(0, 10))
                setIndex(0)
                setPages(Math.floor(data.data.length / 10) + 1)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const next = () => {
        setDocentesMostrar(docentes.slice((index + 1) * 10, (index + 2) * 10))
        setIndex(index + 1)
    }

    const back = () => {
        if (index - 1 === 0) {
            setDocentesMostrar(docentes.slice(0, 10))
            setIndex(0)
        } else {
            setDocentesMostrar(docentes.slice((index - 1) * 10, (index) * 10))
            setIndex(index - 1)
        }
    }

    useEffect(() => {
        getDocentes()
    }, [])

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
                        <Form.Label htmlFor="teacherID">Docente</Form.Label>
                        <InputGroup className="mb-3" controlId="teacher">
                            <Button onClick={back} disabled={index === 0} variant="outline-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg></Button>
                            <Form.Select
                                id="teacherID"
                                name="teacherID"
                                defaultValue=""
                                required>
                                <option disabled value="">Seleccione docente...</option>
                                {docentesMostrar.map((docente) => {
                                    return <option key={docente.id} value={docente.id}>{docente.name + " " + docente.surname}</option>
                                })}
                            </Form.Select>
                            <Button onClick={next} disabled={index === pages - 1} variant="outline-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                            </svg></Button>
                        </InputGroup>
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