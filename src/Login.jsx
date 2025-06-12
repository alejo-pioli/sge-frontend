import { Form, Button, Row, Col } from "react-bootstrap"
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

export default function Login() {

    const requestToken = (e) => {
        e.preventDefault()

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return
        }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        console.log(data)

        return axios.post("http://localhost:3000/api/auth/login", data)
            .then((data) => {
                console.log(data.data.token)
                localStorage.setItem("token", data.data.token)
            }).catch((error) => {
                console.log(`Error: ${error}`)
            })
    }

    return (
        <div className="container pt-3">
            <h1>Iniciar sesión</h1>
            <Form autoComplete="off" onSubmit={requestToken}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="fulanodetal2000@correo.com"
                        required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="UTN123"
                        required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                        name="isTeacher"
                        defaultValue=""
                        required>
                        <option disabled value="">Seleccione rol...</option>
                        <option value="false">Alumno</option>
                        <option value="true">Docente</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
            <Link to={"/"}><Button variant="secondary">Menú</Button></Link>
        </div>
    )
}