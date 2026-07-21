import { z } from "zod"

export const createFormInput = z.object({
    title : z.string().max(55).describe("Title of the form"),
    description : z.string().max(300).optional().describe("Description of the form"),
    createdBy : z.uuid().describe("uuid of the user who created the form"),
})

export type CreateFormInputType = z.infer<typeof createFormInput>


export const listFormsByUserIdInput = z.object({
    userId : z.uuid().describe("uuid of the user whose forms should be listed"),
})

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>
