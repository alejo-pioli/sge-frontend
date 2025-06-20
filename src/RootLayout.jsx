import { Card, Nav } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import arania from './assets/Araña.svg'
import { useAPI, logout, getUser } from "./lib/api";
import Login from "./Login";
import { Link } from "react-router-dom";
import { useLoginInfo } from "./lib/LoginContext";

export default function RootLayout() {
    const [login, refresh] = useLoginInfo()

    if (!login) {
        return (
            <div className="root-layout">
                <div className="full-viewport container pt-4">
                    <Login />
                </div>
            </div>
        )
    }

    const datos = useAPI(getUser, login.role, login.id) ?? { name: "...", surname: "", dni: 0 }

    function cerrarSesion() {
        logout()
        refresh()
    }

    return (
        <div className="root-layout">
            <div className="sidebar sticky-top d-flex flex-column p-2">
                <Card bg={login.role === "admin" ? "danger" : "primary"} className="profile text-white px-3 py-2">
                    <Link to={"/perfil"} className="stretched-link" />
                    <div className="fs-5">{datos.name} {datos.surname}</div>
                    {login.role === "admin" ? (
                        <small>(modo administrador)</small>
                    ) : (
                        <small>DNI {datos.dni}</small>
                    )}
                </Card>
                <Nav className="nav-pills flex-column flex-grow-1">
                        <Nav.Link as={Link} to={"/materias"}>
                            Materias
                        </Nav.Link>
                    {login.role === "teacher" ? (
                        <Nav.Link as={Link} to={"/crear-materia"}>
                            Crear materia
                        </Nav.Link>
                    ) : login.role === "admin" ? (
                        <>
                            <Nav.Link as={Link} to={"/crear-materia"}>
                                Crear materia
                            </Nav.Link>
                            <Nav.Link as={Link} to={"/crear-docente"}>
                                Agregar docente
                            </Nav.Link>
                            <Nav.Link as={Link} to={"/crear-alumno"}>
                                Agregar alumno
                            </Nav.Link>
                        </>
                    ) : (
                        <Nav.Link as={Link} to={"/inscripcion"}>
                            Inscripciones
                        </Nav.Link>
                    )}
                    <div className="flex-grow-1"></div>
                    <Nav.Link as="button" onClick={cerrarSesion} className="text-start link-danger">
                        Cerrar sesión
                    </Nav.Link>
                </Nav>
                <img src={arania} className="arania" />
            </div>
            <div className="container pt-3">
                <Outlet />
            </div>
        </div>
    )
}