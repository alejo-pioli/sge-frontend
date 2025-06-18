import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Card, CardBody, CardHeader } from 'react-bootstrap'
import { use } from 'react'
import { SubjectSchema, TeacherSchema } from './lib/schema'
import { z } from 'zod/v4'
import { getLoginInfo, getMaterias, useAPI } from './lib/api'

export default function Materias() {
    const login = getLoginInfo()

    const materias = useAPI(getMaterias, login.id, login.role === "teacher")

    return (
        <>
            <h1>Tus materias</h1>
            {materias && materias.length > 0 &&
                materias.map((m) => (
                    <Card>
                        <CardHeader>
                            <h4>
                                {m.name}
                            </h4>
                        </CardHeader>
                        <CardBody>
                        <p><strong>Profe:</strong> {m.Teacher.name} {m.Teacher.surname}</p>
                        </CardBody>
                    </Card>
                ))}
        </>
    )
}