//@ts-check
import axios from "axios"
import { useEffect } from "react"
import { z } from "zod/v4"
import { LoginResult, SubjectSchema, TeacherSchema } from "./schema"
import { useState } from "react"

const TOKEN_KEY = "token"
const EXPIRY_KEY = "expiry"
const USER_KEY = "user"
const ROLE_KEY = "role"

/**
 * Devuelve el token si todavía no expiro
 * @returns el token
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

/**
 * Hace un GET a un endpoint de la API
 * @param {string} path la ruta relativa a /api (ej. /login)
 * @param {boolean} auth si requiere autenticarse con el token
 */
export async function apiGet(path, auth = true) {
    return await axios.get("http://localhost:3000/api" + path, {
        headers: auth ? {
            "Authorization": "Bearer " + getLoginInfo()?.token
        } : {}
    })
}

/**
 * Hace un POST a un endpoint de la API
 * @param {string} path la ruta relativa a /api (ej. /login)
 * @param {any} data los datos
 * @param {boolean} auth si requiere autenticarse con el token
 */
export async function apiPost(path, data, auth = true) {
    return await axios.post("http://localhost:3000/api" + path, data, {
        headers: auth ? {
            "Authorization": "Bearer " + getLoginInfo()?.token
        } : {}
    })
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

    useEffect(() => {
        setValue(null)
        fn(...args).then((val) => setValue(val)).catch((err) => console.error(err))
    }, args)

    console.log({ value })

    return value
}

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

const SubjectWithTeacher = SubjectSchema.extend({
    Teacher: TeacherSchema
})

const PostResult = z.object({
    ok: z.boolean(),
    id: z.number(),
})

/**
 * @param {number} id identificador del usuario
 * @param {boolean} isTeacher si es un docente
 */
export async function getMaterias(id, isTeacher) {
    const { data } = await apiGet("/materias" + (isTeacher ? "?docente=" + id : "?alumno=" + id))

    return z.array(SubjectWithTeacher).parse(data)
}

/**
 * 
 * @param {number} id 
 */
export async function getAlumno(id) {
    const { data } = await apiGet(`/alumnos/${id}`)

    return data
}

/**
 * 
 * @param {number} id 
 */
export async function getDocente(id) {
    const { data } = await apiGet(`/docentes/${id}`)

    return data
}

/**
 * @param {any} data
 */
export async function postDocente(data){
    return await apiPost("/docentes", data)
}

export async function getTodasLasMaterias() {
    const { data } = await apiGet("/materias")

    return z.array(SubjectWithTeacher).parse(data)
}

/**
 * @param {number} studentID identificador del usuario
 * @param {number} subjectID identificador de la materia
 */
export async function postInscripcion(studentID, subjectID) {
    const { data } = await apiPost("/inscripciones", { studentID, subjectID})

    return PostResult.parse(data)
}

/**
 * @param {SubjectSchema} materia la materia
 */
export async function postMateria(materia) {
    const { data } = await apiPost("/materias", materia)

    return PostResult.parse(data)
}