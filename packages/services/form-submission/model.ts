import { z } from "zod"

export const submitFormInput = z.object({
    formId: z.uuid().describe("uuid of the form receiving the submission"),
    values: z.array(
        z.object({
            formFiledId: z.string().describe("id of the field being answered"),
            value: z.string().describe("answer value for the field"),
        })
    ).default([]).describe("answers submitted for the form"),
})

export type SubmitFormInputType = z.infer<typeof submitFormInput>

export const getFormSubmissionsInput = z.object({
    formId: z.uuid().describe("uuid of the form whose submissions should be fetched"),
})

export type GetFormSubmissionsInputType = z.infer<typeof getFormSubmissionsInput>
