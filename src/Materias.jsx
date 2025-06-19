import { Button, Card, CardBody, CardHeader, Container, Table } from 'react-bootstrap'
import { getMaterias, getTodasLasMaterias, useAPI } from './lib/api'
import { Link } from 'react-router-dom'
import { useLoginInfo } from './lib/LoginContext'

export function MateriasLectura() {
    const [login] = useLoginInfo()

    const materias = useAPI(getMaterias, login.id, login.role === "teacher")

    return (
        <>
            <h1>Tus materias</h1>
            <Container fluid className="materias">
                {materias && materias.length > 0 && (
                    materias.map((m) => (
                        <Card as={Link} to={"/materias/" + m.id} key={m.id}>
                            <CardHeader>
                                <h4 className='m-0'>
                                    {m.name}
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <strong>Profesor:</strong> {m.Teacher.name} {m.Teacher.surname}
                            </CardBody>
                        </Card>
                    ))
                )}
            </Container>
        </>
    )
}

export function MateriasAdmin() {
    const [login] = useLoginInfo()

    const materias = useAPI(getTodasLasMaterias)

    return (
        <>
            <h1>Administrar materias</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Profesor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {materias && materias.length > 0 && (
                        materias.map((m) => (
                            <tr>
                                <td>{m.name}</td>
                                <td>{m.Teacher.name} {m.Teacher.surname}</td>
                                <td>
                                    <Button variant="danger">
                                        Borrar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
            <Container fluid className="materias">
            </Container>
        </>
    )
}

export default function Materias() {
    const [login] = useLoginInfo()

    if (login.role === "admin") {
        return <MateriasAdmin />
    } else {
        return <MateriasLectura />
    }
}