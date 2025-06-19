import { Card, CardBody, CardHeader, Container } from 'react-bootstrap'
import { getMaterias, useAPI } from './lib/api'
import { Link } from 'react-router-dom'
import { useLoginInfo } from './lib/LoginContext'

export default function Materias() {
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