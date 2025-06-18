import { Button, Card, CardBody, CardFooter, CardHeader, Container } from 'react-bootstrap'
import { getLoginInfo, getMaterias, getTodasLasMaterias, postInscripcion, useAPI } from './lib/api'
import { useEffect } from 'react'
import { useState } from 'react'

export default function InscripcionAMateria() {
    const login = getLoginInfo()

    const inscriptas = useAPI(getMaterias, login.id, login.role === "teacher")

    const materiasDisponibles = useAPI(getTodasLasMaterias)

    const [idsInscriptas, setIDsInscriptas] = useState(new Set())

    useEffect(() => {
        if (inscriptas) {
            setIDsInscriptas(new Set(inscriptas.map(m => m.id)))
        }
    }, [inscriptas])

    async function inscribirse(id) {
        const set = new Set(idsInscriptas)
        set.add(id)
        setIDsInscriptas(set)

        try {
            await postInscripcion(login.id, id)
        } catch (error) {
            console.error(error)

            const set = new Set(idsInscriptas)
            set.delete(id)
            setIDsInscriptas(set)
        }
    }

    return (
        <>
            <h1>Materias disponibles para cursado</h1>
            <Container fluid className="materias">
                {materiasDisponibles && materiasDisponibles.length > 0 && (
                    materiasDisponibles.map((m) => (
                        <Card>
                            <CardHeader>
                                <h4 className='m-0'>
                                    {m.name}
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <strong>Profesor:</strong> {m.Teacher.name} {m.Teacher.surname}
                            </CardBody>
                            <CardFooter className="d-flex justify-content-end">
                                {idsInscriptas.has(m.id) 
                                    ? (
                                        <Button disabled variant='secondary'>
                                            Ya inscripto
                                        </Button>
                                    ) : (
                                        <Button onClick={() => inscribirse(m.id)}>
                                            Inscribirse
                                        </Button>
                                    )}
                            </CardFooter>
                        </Card>
                    ))
                )}
            </Container>
        </>
    )
}