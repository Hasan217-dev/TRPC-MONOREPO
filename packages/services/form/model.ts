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

export const getFormByIdInput = z.object({
    id : z.uuid().describe("uuid of the form to fetch"),
})

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>

export const submitFormInput = z.object({
    formId : z.uuid().describe("uuid of the form receiving the submission"),
    values : z.array(
        z.object({
            formFiledId : z.string().describe("id of the field being answered"),
            value : z.string().describe("answer value for the field"),
        })
    ).default([]).describe("answers submitted for the form"),
})

export type SubmitFormInputType = z.infer<typeof submitFormInput>
