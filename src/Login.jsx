import { Form, Button, Row, Col } from "react-bootstrap"
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { postLogin } from "./lib/api";
import { toast } from 'react-toastify';
import { useLoginInfo } from "./lib/LoginContext";


export default function Login() {
    const [_, refresh] = useLoginInfo()

    async function requestToken(e) {
        e.preventDefault()

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return
        }

        const formData = new FormData(e.target);
    
        try {
            await postLogin(
                formData.get("email"),
                formData.get("password"),
                formData.get("isTeacher") === "true",
            );

            toast.success("Inicio sesion exitoso!", {
                position: "top-right",
                autoClose: 5000
            });

            refresh()
        } catch (error) {
            console.error(error)
            toast.error("Usuario, contraseña o rol incorrectos.", {
                position: "top-right",
                autoClose: 5000
            });
        }

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