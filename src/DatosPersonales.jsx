import { Card, Nav, Table } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import arania from './assets/Araña.svg'
import { useAPI, logout, getUser } from "./lib/api";
import Login from "./Login";
import { Link } from "react-router-dom";
import { useLoginInfo } from "./lib/LoginContext";

export function careerToString(value) {
    return value === "A" ? "Ingeniería en Sistemas de Información" :
           value === "B" ? "Ingeniería Química" :
           value === "C" ? "Ingeniería Electrónica" :
           value === "D" ? "Ingeniería Electromecánica" :
           value === "E" ? "Ingeniería Industrial" :
           "Sin carrera"
}

export default function DatosPersonales() {
    const [login, refresh] = useLoginInfo()

    const datos = useAPI(getUser, login.role, login.id)

    if (!datos) return null

    return (
        <>
            <h1>{datos.name} {datos.surname}</h1>
            <Table>
                <tbody>
                    <tr>
                        <th>DNI</th>
                        <td>{datos.dni}</td>
                    </tr>
                    <tr>
                        <th>Correo</th>
                        <td>{datos.email}</td>
                    </tr>
                    <tr>
                        <th>Teléfono</th>
                        <td>{datos.phone}</td>
                    </tr>
                    <tr>
                        <th>Carrera</th>
                        <td>{careerToString(datos.career)}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}