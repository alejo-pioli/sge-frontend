import { z } from "zod/v4";

/**
 * @typedef {z.infer<typeof StudentSchema>} StudentSchema
 */
export const StudentSchema = z.object({
    id: z.int(),
    name: z.string(),
    surname: z.string(),
    dni: z.int(),
    email: z.email(),
    phone: z.string(),
    career: z.literal(["A", "B", "C", "D", "E", "Z"]),
    password: z.string(),
})

/**
 * @typedef {z.infer<typeof TeacherSchema>} TeacherSchema
 */
export const TeacherSchema = z.object({
    id: z.int(),
    name: z.string(),
    surname: z.string(),
    dni: z.int(),
    email: z.email(),
    phone: z.string(),
    password: z.string(),
})

/**
 * @typedef {z.infer<typeof AbsenceSchema>} AbsenceSchema
 */
export const AbsenceSchema = z.object({
    id: z.int(),
    date: z.string().pipe( z.coerce.date() ),
    justified: z.boolean(),
    studentID: z.int(),
    subjectID: z.int(),
})

/**
 * @typedef {z.infer<typeof GradeSchema>} GradeSchema
 */
export const GradeSchema = z.object({
    id: z.int(),
    instance: z.string(),
    grade: z.int(),
    studentID: z.int(),
    subjectID: z.int(),
})

/**
 * @typedef {z.infer<typeof EnrollmentSchema>} EnrollmentSchema
 */
export const EnrollmentSchema = z.object({
    id: z.int(),
    instance: z.string(),
    grade: z.int(),
    studentID: z.int(),
    subjectID: z.int(),
})

/**
 * @typedef {z.infer<typeof SubjectSchema>} SubjectSchema
 */
export const SubjectSchema = z.object({
    id: z.int(),
    name: z.string(),
    career: z.literal(["A", "B", "C", "D", "E", "Z"]),
    duration: z.literal([ 0, 1, 2 ]),
    schedule: z.string(),
    teacherID: z.int(),
})

/** 
 * @typedef {z.infer<typeof LoginResult>} LoginResult
 */
export const LoginResult = z.object({
    /**todo está bien */
    ok: z.boolean(), 
    /** el JWT */
    token: z.string(), 
    /** tiempo hasta la expiración en segundos */
    expiresIn: z.number(), 
    /** si tiene un rol "teacher" o "student" */
    role: z.string(), 
    /** el identificador del usuario */
    id: z.number(), 
})