import { Form, Button, Row, Col } from "react-bootstrap"

export default function Login() {
    return (
        <div className="container pt-3">
            <h1>Iniciar sesión</h1>
            <Form autoComplete="off">
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
                        <option value={true}>Alumno</option>
                        <option value={false}>Docente</option>
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
        </div>
    )
}