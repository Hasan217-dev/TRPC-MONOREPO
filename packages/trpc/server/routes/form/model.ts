import {z} from 'zod'

export const createFormInputModel = z.object({
    title : z.string().max(50).describe("Title of the user"),
    description : z.string().max(300).optional().describe("Description of form")
});

export const createFormOutputModel = z.object({
    id : z.string().describe("ID of the form")
});