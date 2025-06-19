import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { postDocente, unauthorizedHandler } from './lib/api';
import { useLoginInfo } from './lib/LoginContext';

export default function CrearDocente() {
    const [_, refresh] = useLoginInfo()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        data.dni = parseInt(data.dni)

        const datos = await postDocente(data).catch(unauthorizedHandler(refresh))
        console.log(datos)
        if(datos.ok){
            e.target.reset()
        }
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
                        <Form.Group className="mb-3" controlId="dni">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control
                                min="1"
                                max="100000000"
                                type="number"
                                name="dni"
                                placeholder="40000000"
                                required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="hola123"
                        required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
        </>
    )
}