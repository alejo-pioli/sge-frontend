import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, Row, Col } from 'react-bootstrap'

export default function CrearDocente() {

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
            const response = await axios.post("http://localhost:3000/api/docentes", data);
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }

        e.target.reset()
    };

    return (
        <>
            <h1>Crear docente</h1>
            <Form autoComplete="off" onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Ingrese nombre"
                                required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="apellido">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                placeholder="Ingrese apellido"
                                required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Ingrese email"
                        required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="dni">
                    <Form.Label>DNI</Form.Label>
                    <Form.Control
                        max="100000000"
                        type="number"
                        name="dni"
                        placeholder="Ingrese DNI"
                        required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
        </>
    )
}