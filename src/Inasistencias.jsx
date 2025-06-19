import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Tab, Table } from 'react-bootstrap'
import { getAlumnosInscriptos, getCalificaciones, getInasistencias, getMateria, getMaterias, useAPI } from './lib/api'
import { Link, useParams } from 'react-router-dom'
import { useLoginInfo } from './lib/LoginContext'

/**
 * @typedef {object} InasistenciasProps
 * @prop {number} id
 */


/** @param {InasistenciasProps} props */
function InasistenciasDocentes(props) {
    
}

/** @param {InasistenciasProps} props */
function InasistenciasAlumnos(props) {
    const [login] = useLoginInfo()

    const materia = useAPI(getMateria, props.id)
    const inasistencias = useAPI(getInasistencias, props.id, login.id)

    if (!materia || !inasistencias) return null

    return (
        <>
            <h1>{materia.name}</h1>
            <h4>Inasistencias</h4>
            <Table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Justificada</th>
                    </tr>
                </thead>
                <tbody>
                    {inasistencias.map((c) => (
                        <tr>
                            <td>
                                {c.date}
                            </td>
                            <td>
                                {c.justified ? "Justificada" : "No justificada"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default function Inasistencias() {
    const [login] = useLoginInfo()

    const params = useParams()

    const id = parseInt(params.id)
    
    if (login.role === "teacher") {
        return <InasistenciasDocentes id={id} />
    } else {
        return <InasistenciasAlumnos id={id} />
    }
}