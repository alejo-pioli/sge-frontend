import { Card, Nav } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import arania from './assets/Araña.svg'
import { getLoginInfo } from "./lib/api";
import Login from "./Login";

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

    return (
        <div className="root-layout">
            <div className="sidebar sticky-top d-flex flex-column p-2">
                <Card className="profile bg-primary text-white px-3 py-2">
                    <div className="fs-5">Fulanito de Tal</div>
                    <small>DNI 45702443</small>
                </Card>
                <Nav className="nav-pills flex-column flex-grow-1">
                    <Nav.Link>
                        Materias
                    </Nav.Link>
                    <Nav.Link>
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