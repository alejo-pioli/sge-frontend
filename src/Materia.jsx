import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Tab, Table } from 'react-bootstrap'
import { getAlumnosInscriptos, getCalificaciones, getInasistencias, getMateria, getMaterias, useAPI } from './lib/api'
import { Link, useParams } from 'react-router-dom'
import { useLoginInfo } from './lib/LoginContext'

export default function Materia() {
    const [login] = useLoginInfo()

    const { id } = useParams()

    const materia = useAPI(getMateria, id)

    const calificaciones = useAPI(getCalificaciones, id, login.id)
    const inasistencias = useAPI(getInasistencias, id, login.id)
    const alumnos = useAPI(getAlumnosInscriptos, id) ?? []

    if (!materia) {
        return null
    }

    return (
        <>
            <h1>{materia.name}</h1>
            <p><strong>Profesor:</strong> {materia.Teacher.name} {materia.Teacher.surname} - <strong>Horarios:</strong> {materia.schedule}</p>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <h4 className='m-0'>
                                Calificaciones
                            </h4>
                        </CardHeader>
                        <CardBody>
                            <Table>
                                <tr>
                                    <th>Instancia</th>
                                    <th>Calif.</th>
                                </tr>
                                {calificaciones && calificaciones.map((c) => (
                                    <tr>
                                        <td>
                                            {c.instance}
                                        </td>
                                        <td>
                                            {c.grade}
                                        </td>
                                    </tr>
                                ))}
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <CardHeader>
                            <h4 className='m-0'>
                                Inasistencias
                            </h4>
                        </CardHeader>
                        <CardBody>
                            {inasistencias?.length ?? 0} faltas
                        </CardBody>
                        <CardFooter className='d-flex justify-content-end'>
                            <Button as={Link} to={`/inasistencias/${id}`}>
                                Ver más...
                            </Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
            {login.role !== "student" ?
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <h4 className='m-0'>
                                    Alumnos
                                </h4>
                            </CardHeader>
                            <CardBody>
                                {alumnos?.length ?? 0} {alumnos?.length === 1 ? "alumno" : "alumnos"}
                            </CardBody>
                            <CardFooter>
                                <Button as={Link} to={"/alumnos/" + id}>Ver más</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
                : <></>}
        </>
    )
}