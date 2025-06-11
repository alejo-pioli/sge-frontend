import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, Row, Col } from 'react-bootstrap'

export default function CrearAlumno() {

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post("http://localhost:3000/api/alumnos", data);
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }

        e.target.reset()
    };

    return (
        <>
            <h1>Crear alumno</h1>
            <Form autoComplete="off" onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Fulano"
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="apellido">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                placeholder="de Tal"
                                required />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="fulanodetal2000@correo.com"
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                placeholder="0800 888888"
                                required />
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
                                <option value="A">Ingeniería en Sistemas de Información</option>
                                <option value="B">Ingeniería Química</option>
                                <option value="C">Ingeniería Electrónica</option>
                                <option value="D">Ingeniería Electromecánica</option>
                                <option value="E">Ingeniería Industrial</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="dni">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control
                                max="100000000"
                                type="number"
                                name="dni"
                                placeholder="40000000"
                                required />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
        </>
    )
}