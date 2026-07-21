import { z } from "zod"

export const createFormInputModel = z.object({
    title : z.string().max(55).describe("Title of the form"),
    description : z.string().max(300).optional().describe("Description of the form"),
})

export const createFormOutputModel = z.object({
    id : z.string().describe("id of the form created"),
})

export const listFormsOutputModel = z.array(
    z.object({
        id : z.string().describe("id of the form"),
        title : z.string().describe("title of the form"),
        description : z.string().nullable().describe("description of the form"),
        createdBy : z.string().nullable().describe("id of the user who created the form"),
        createdAt : z.date().nullable().describe("date when the form was created"),
        updatedAt : z.date().nullable().describe("date when the form was last updated"),
    })
)
