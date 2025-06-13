import axios from "axios"
import { useEffect } from "react"
import { z } from "zod/v4"
import { SubjectSchema, TeacherSchema } from "./schema"
import { useState } from "react"

export async function apiGet(path, auth = true) {
    return await axios.get("http://localhost:3000/api" + path, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
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
    const [value, setValue] = useState(null)

    useEffect(() => {
        setValue(null)
        fn(...args).then((val) => setValue(val)).catch((err) => console.error(err))
    }, args)

    console.log({ value })

    return value
}

const SubjectWithTeacher = SubjectSchema.extend({
    Teacher: TeacherSchema
})

export const getMaterias = () => apiGet("/materias").then((res) => z.array(SubjectWithTeacher).parse(res.data))