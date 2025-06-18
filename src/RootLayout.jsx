import { Card, Nav } from "react-bootstrap";
import { Links, Outlet } from "react-router-dom";
import arania from './assets/Araña.svg'
import { getAlumno, getLoginInfo, useAPI, getDocente } from "./lib/api";
import Login from "./Login";
import { Link } from "react-router-dom";

export default function RootLayout() {
    const login = getLoginInfo()

    if (!login) {
        return (
            <div className="root-layout">
                <div className="full-viewport container pt-3">
                    <Login />
                </div>
            </div>
        )
    }

    let method
    if (login.role = "teacher"){
        method = getDocente
    }
    else {
        method = getAlumno
    }

    const datos = useAPI(method, login.id) || { name: "...", surname: "", dni: 0 }
    console.log(datos)

    return (
        login.role === "teacher" ?
            <div className="root-layout">
                <div className="sidebar sticky-top d-flex flex-column p-2">
                    <Card className="profile bg-primary text-white px-3 py-2">
                        <div className="fs-5">{datos.name} {datos.surname}</div>
                        <small>DNI {datos.dni}</small>
                    </Card>
                    <Nav className="nav-pills flex-column flex-grow-1">
                        <Nav.Link as={Link} to={"/materias"}>
                            Materias
                        </Nav.Link>
                        <Nav.Link as={Link} to={"/crear-materia"}>
                            Crear materia
                        </Nav.Link>
                        <div className="flex-grow-1"></div>
                        <Nav.Link className="link-danger">
                            Cerrar sesión
                        </Nav.Link>
                    </Nav>
                    <img src={arania} className="arania" />
                </div>
                <div className="container pt-3">
                    <Outlet />
                </div>
            </div>
            :
            <div className="root-layout">
                <div className="sidebar sticky-top d-flex flex-column p-2">
                    <Card className="profile bg-primary text-white px-3 py-2">
                        <div className="fs-5">{datos.name} {datos.surname}</div>
                        <small>DNI {datos.dni}</small>
                    </Card>
                    <Nav className="nav-pills flex-column flex-grow-1">
                        <Nav.Link as={Link} to={"/materias"}>
                            Materias
                        </Nav.Link>
                        <Nav.Link as={Link} to={"/inscripcion"}>
                            Inscripciones
                        </Nav.Link>
                        <div className="flex-grow-1"></div>
                        <Nav.Link className="link-danger">
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