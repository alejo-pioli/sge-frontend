//@ts-check
import axios from "axios"
import { useEffect } from "react"
import { z } from "zod/v4"
import { AbsenceSchema, GradeSchema, LoginResult, StudentSchema, SubjectSchema, TeacherSchema } from "./schema"
import { useState } from "react"
import { useLoginInfo } from "./LoginContext"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

/*=== UTILIDADES ===*/

const TOKEN_KEY = "token"
const EXPIRY_KEY = "expiry"
const USER_KEY = "user"
const ROLE_KEY = "role"

/**
 * @typedef {object} LoginInfo
 * @prop {string} token
 * @prop {number} id
 * @prop {string} role
 */

/**
 * Devuelve el token si todavía no expiro
 * @returns {LoginInfo | null}
 */
export function getLoginInfo() {
    const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) ?? "0")
    const now = new Date().getTime()
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token || now >= expiry) {
        return null
    }

    return {
        token,
        id: parseInt(localStorage.getItem(USER_KEY) ?? "0"),
        role: localStorage.getItem(ROLE_KEY) ?? "student",
    }
}

const api = axios.create({
    baseURL: "http://localhost:3000/api"
})

const getHeaders = (auth) => (
     auth ? {
        "Authorization": "Bearer " + getLoginInfo()?.token
    } : {}
)

/**
 * Hace un GET a un endpoint de la API
 * @param {string} path la ruta relativa a /api (ej. /login)
 * @param {boolean} auth si requiere autenticarse con el token
 */
export const apiGet = (path, auth = true) => api.get(path, { headers: getHeaders(auth) })

/**
 * Hace un POST a un endpoint de la API
 * @param {string} path la ruta relativa a /api (ej. /login)
 * @param {any} data los datos
 * @param {boolean} auth si requiere autenticarse con el token
 */
export const apiPost = (path, data, auth = true) => api.post(path, data, { headers: getHeaders(auth) })

/**
 * Hace un PUT a un endpoint de la API
 * @param {string} path la ruta relativa a /api (ej. /login)
 * @param {any} data los datos
 * @param {boolean} auth si requiere autenticarse con el token
 */
export const apiPut = (path, data, auth = true) => api.put(path, data, { headers: getHeaders(auth) })

/**
 * Hace un DELETE a un endpoint de la API
 * @param {string} path la ruta relativa a /api (ej. /login)
 * @param {boolean} auth si requiere autenticarse con el token
 */
export const apiDelete = (path, auth = true) => api.delete(path, { headers: getHeaders(auth) })

/**
 * @param {Record<string, string | undefined>} values 
 */
export function params(values) {
    return new URLSearchParams(
        //@ts-expect-error
        Object.entries(values).filter(([key, value]) => value != undefined)
    ).toString()
}

/**
 * Cerrar sesión
 */
export function logout() {
    if (localStorage.getItem(TOKEN_KEY)) {
        console.log("logging out")
        localStorage.removeItem(TOKEN_KEY)
        return true
    }
    return false
}

export function unauthorizedHandler(refresh) {
    return (err) => {
        console.error(err)
    
        if (err instanceof AxiosError && err.status === 401) {
            if (logout()) {
                toast.error("La sesión ha vencido, vuelva a iniciar sesión.", {
                    position: "top-right",
                    autoClose: 5000
                })
                refresh()
            }
        } else {
            throw err
        }
    }
}

/**
 * @template {any[]} A
 * @template R
 * @param {(...args: A) => Promise<R>} fn 
 * @param  {A} args 
 * @returns {R | null}
 */
export function useAPI(fn, ...args) {
    const [value, setValue] = useState(/** @type {R | null} */(null))
    
    const [_, refresh] = useLoginInfo()

    useEffect(() => {
        setValue(null)
        fn(...args)
            .then((val) => setValue(val))
            .catch(unauthorizedHandler(refresh))
    }, args)

    //console.log({ value })

    return value
}

/*=== CONEXIÓN A ENDPOINTS ===*/

/*== Schemas bonus ==*/

const SubjectWithTeacher = SubjectSchema.extend({
    Teacher: TeacherSchema
})

const PostResult = z.object({
    ok: z.boolean(),
    id: z.number(),
})

/*== Autenticación ==*/

/**
 * Inicia sesión
 * @param {string} email el correo
 * @param {string} password la contraseña
 * @param {boolean} isTeacher si el usuario inicia sesión con el rol de profesor
 * @returns {Promise<LoginResult | null>}
 */
export async function postLogin(email, password, isTeacher) {
    const data = await apiPost("/auth/login", { email, password, isTeacher }, false).then((res) => LoginResult.parse(res.data))

    if (data.ok) {
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(EXPIRY_KEY, "" + (new Date().getTime() + data.expiresIn * 1000))
        localStorage.setItem(USER_KEY, "" + data.id)
        localStorage.setItem(ROLE_KEY, "" + data.role)

        return data
    }

    return null
}

/*== Materias ==*/

/**
 * @param {number} id identificador del usuario
 * @param {boolean} isTeacher si es un docente
 */
export async function getMaterias(id, isTeacher) {
    const { data } = await apiGet("/materias" + (isTeacher ? "?docente=" + id : "?alumno=" + id))

    return z.array(SubjectWithTeacher).parse(data)
}

export async function getTodasLasMaterias() {
    const { data } = await apiGet("/materias")

    return z.array(SubjectWithTeacher).parse(data)
}

/**
 * @param {number} id identificador de la materia
 */
export async function getMateria(id) {
    const { data } = await apiGet("/materias/" + id)

    return SubjectWithTeacher.parse(data)
}

/**
 * @param {SubjectSchema} materia la materia
 */
export async function postMateria(materia) {
    const { data } = await apiPost("/materias", materia)

    return PostResult.parse(data)
}

/**
 * @param {number} id la materia
 */
export async function deleteMateria(id) {
    const { data } = await apiDelete(`/materias/${id}`)

    return data
}

/**
 * @param {number} id identificador de la materia
 */
export async function getAlumnosInscriptos(id) {
    const { data } = await apiGet(`/alumnos/?materia=${id}`)

    return z.array(StudentSchema).parse(data)
}

/**
 * @param {number} studentID identificador del usuario
 * @param {number} subjectID identificador de la materia
 */
export async function postInscripcion(studentID, subjectID) {
    const { data } = await apiPost("/inscripciones", { studentID, subjectID})

    return PostResult.parse(data)
}

/*== Alumnos ==*/

/**
 * @param {number} id 
 */
export async function getAlumno(id) {
    const { data } = await apiGet(`/alumnos/${id}`)

    return StudentSchema.parse(data)
}

/**
 * @param {StudentSchema} alumno el alumno
 */
export async function postAlumno(alumno) {
    const { data } = await apiPost("/alumnos", alumno)

    return PostResult.parse(data)
}

/*== Asistencia ==*/

/**
 * @param {Omit<AbsenceSchema, "id">} absence 
 */
export async function postInasistencia(absence) {
    const { data } = await apiPost(`/inasistencias`, absence)

    return PostResult.parse(data)
}

/**
 * @param {AbsenceSchema} absence 
 */
export async function putInasistencia(absence) {
    const { data } = await apiPut(`/inasistencias/${absence.id}`, absence)

    return PostResult.parse(data)
}

/**
 * @param {number} id 
 */
export async function deleteInasistencia(id) {
    const { data } = await apiDelete(`/inasistencias/${id}`)

    return data
}

/**
 * @param {number} subjectID 
 * @param {number=} studentID 
 */
export async function getInasistencias(subjectID, studentID) {
    const params = new URLSearchParams({
        materia: subjectID.toString(),
    })
    if (studentID) {
        params.set("alumno", "" + studentID)
    }
    const { data } = await apiGet(`/inasistencias?` + params.toString())

    return z.array(AbsenceSchema).parse(data)
}

/**
 * @param {number} subjectID 
 * @param {Date=} start 
 * @param {Date=} end 
 */
export async function getTodasLasInasistencias(subjectID, start, end) {
    const { data } = await apiGet(`/inasistencias?` + params({
        materia: subjectID.toString(),
        start: start?.toISOString(),
        end: end?.toISOString(),
    }))

    return z.array(AbsenceSchema).parse(data)
}

/*== Calificaciones ==*/

/**
 * @param {number} subjectID 
 * @param {number=} studentID 
 */
export async function getCalificaciones(subjectID, studentID) {
    const params = new URLSearchParams({
        materia: subjectID.toString(),
    })
    if (studentID) {
        params.set("alumno", "" + studentID)
    }
    const { data } = await apiGet(`/calificaciones?` + params.toString())

    return z.array(GradeSchema).parse(data)
}

/**
 * @param {number} subjectID 
 * @param {number} studentID 
 * @param {string} instance 
 * @param {number} grade 
 */
export async function postCalificacion(subjectID, studentID, instance, grade) {
    const { data } = await apiPost(`/calificaciones`, {
        studentID, subjectID, instance, grade
    })

    return PostResult.parse(data)
}

/**
 * @param {GradeSchema} grade 
 */
export async function putCalificacion(grade) {
    const { data } = await apiPut(`/calificaciones/${grade.id}`, grade)

    return PostResult.parse(data)
}

/**
 * @param {number} id 
 */
export async function deleteCalificacion(id) {
    const { data } = await apiDelete(`/calificaciones/${id}`)

    return data
}

/*== Docentes ==*/

/**
 * 
 * @param {number} id 
 */
export async function getDocente(id) {
    const { data } = await apiGet(`/docentes/${id}`)

    return TeacherSchema.parse(data)
}

/**
 * @param {any} data
 */
export async function postDocente(data){
    return await apiPost("/docentes", data)
}

export async function getDocentes(){
    const { data } = await apiGet("/docentes")

    return z.array(TeacherSchema).parse(data)
}

/*== Otros ==*/

/**
 * Obtener un usuario genérico, alumno o docente
 * @param {string} role 
 * @param {number} id 
 * @returns {Promise<TeacherSchema | StudentSchema>}
 */
export async function getUser(role, id) {
    if (role === "admin") {
        return {
            id: 0,
            career: "Z",
            dni: 0,
            email: "admin@admin.com",
            password: "",
            name: "El",
            surname: "Admin",
            phone: ""
        }
    } else if (role === "teacher") {
        return await getDocente(id)
    } else {
        return await getAlumno(id)
    }
}