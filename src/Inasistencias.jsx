import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, FormCheck, NavDropdown, Row, Tab, Table } from 'react-bootstrap'
import { deleteInasistencia, getAlumnosInscriptos, getCalificaciones, getInasistencias, getMateria, getMaterias, getTodasLasInasistencias, postInasistencia, putInasistencia, useAPI } from './lib/api'
import { Link, useParams } from 'react-router-dom'
import { useLoginInfo } from './lib/LoginContext'
import { useMemo } from 'react'
import { useState } from 'react'
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useCallback } from 'react'

/**
 * @typedef {object} InasistenciasProps
 * @prop {number} id
 */

const hoy = new Date()

/** @param {InasistenciasProps} props */
function InasistenciasDocentes(props) {
    const [login] = useLoginInfo()

    const [fecha, setFecha] = useState(hoy)

    const [start, end] = useMemo(() => {
        const start = new Date(fecha)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(end.getDate() + 1)
        return [start, end]
    }, [fecha])

    const [cambios, setCambios] = useState(new Map())

    const materia = useAPI(getMateria, props.id)
    const alumnos = useAPI(getAlumnosInscriptos, props.id)
    const inasistencias = useAPI(getTodasLasInasistencias, props.id, start, end)

    const inasistenciasMap = useMemo(() => {
        return inasistencias && new Map(inasistencias.map((v) => [v.studentID, v]))
    }, [inasistencias])
    
    const isPresent = useCallback((id) => {
        if (cambios.has(id)) {
            return !cambios.get(id)
        } else {
            return !inasistenciasMap?.has(id)
        }
    }, [cambios, inasistenciasMap])
    
    const isJustified = useCallback((id) => {
        const cambio = cambios.get(id)
        if (cambio) {
            return !!cambio.justified
        } else {
            return !!inasistenciasMap?.get(id)?.justified
        }
    }, [cambios, inasistenciasMap])
    
    const onPresentClick = useCallback((e, id) => {
        if (!(e.target instanceof HTMLInputElement)) return
        
        if (e.target.checked) {
            cambios.set(id, false)
        } else {
            cambios.set(id, {
                ...(cambios.get(id) || {}),
                date: fecha,
                justified: e.target.checked,
                studentID: id,
                subjectID: props.id,
            })
        }

        setCambios(new Map(cambios))
    })
    
    const onJustifiedClick = useCallback((e, id) => {
        if (!(e.target instanceof HTMLInputElement)) return
        
        cambios.set(id, {
            ...(cambios.get(id) || inasistenciasMap.get(id) || {}),
            date: fecha,
            justified: e.target.checked,
            studentID: id,
            subjectID: props.id,
        })

        setCambios(new Map(cambios))
    })

    const subir = useCallback(async () => {
        const ops = []
        for (const [id, cambio] of cambios.entries()) {
            if (cambio) {
                if (cambio.id) {
                    ops.push(putInasistencia(cambio))
                } else {
                    ops.push(postInasistencia(cambio))
                }
            } else {
                const orig = inasistenciasMap.get(id)
                if (orig) {
                    ops.push(deleteInasistencia(orig.id))
                }
            }
        }
        await Promise.all(ops)
        console.log("ok")
    }, [cambios, inasistenciasMap])
    
    console.log(cambios)

    if (!materia) return null

    return (
        <>
            <h1>{materia.name}</h1>
            <h4>Inasistencias</h4>

            <Row>
                <Col>
                    <DayPicker
                        animate
                        mode="single"
                        selected={fecha}
                        onSelect={setFecha}
                    />
                </Col>
                <Col>
                    <Button onClick={subir}>
                        Subir
                    </Button>
                </Col>
            </Row>
            {alumnos && inasistencias && (
                <Table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>DNI</th>
                            <th>Asistió</th>
                            <th>Justificada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map((c) => (
                            <tr>
                                <td>
                                    {c.name}
                                </td>
                                <td>
                                    {c.surname}
                                </td>
                                <td>
                                    {c.dni}
                                </td>
                                <td>
                                    <FormCheck checked={isPresent(c.id)} onChange={(e) => onPresentClick(e, c.id)} />
                                </td>
                                <td>
                                    <FormCheck disabled={isPresent(c.id)} checked={!isPresent(c.id) && isJustified(c.id)} onChange={(e) => onJustifiedClick(e, c.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
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