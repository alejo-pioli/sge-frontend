import { Card, CardBody, CardHeader, Container } from 'react-bootstrap'
import { getLoginInfo, getMaterias, useAPI } from './lib/api'

export default function Materias() {
    const login = getLoginInfo()

    const materias = useAPI(getMaterias, login.id, login.role === "teacher")

    return (
        <>
            <h1>Tus materias</h1>
            <Container fluid className="materias">
                {materias && materias.length > 0 && (
                    materias.map((m) => (
                        <Card key={m.id}>
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