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
 * @returns {string | null} el token
 */
export function getJWT() {
    const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) ?? "0")
    const now = new Date().getTime()
    if (now >= expiry) {
        return null
    }
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * Hace un GET a un endpoint de la API
 * @param {string} path la ruta relativa a /api (ej. /login)
 * @param {boolean} auth si requiere autenticarse con el token
 */
export async function apiGet(path, auth = true) {
    return await axios.get("http://localhost:3000/api" + path, {
        headers: auth ? {
            "Authorization": "Bearer " + getJWT()
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
            "Authorization": "Bearer " + getJWT()
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
    const [value, setValue] = useState(/** @type {R | null} */ (null))

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

export const getMaterias = () => apiGet("/materias").then((res) => z.array(SubjectWithTeacher).parse(res.data))