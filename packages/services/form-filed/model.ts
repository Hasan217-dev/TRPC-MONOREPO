import { z } from "zod"

export const fieldTypeValues = ["TEXT", "NUMBER", "YES_NO", "EMAIL", "PASSWORD"] as const

export const createFiledInput = z.object({
    label: z.string().min(1).max(100).describe("Human readable field label"),
    description: z.string().max(5000).optional().describe("Optional field description"),
    placeholder: z.string().max(500).optional().describe("Optional placeholder text"),
    isRequired: z.boolean().optional().default(false).describe("Whether the field is required"),
    index: z.number().min(0).describe("Fractional sort index for field ordering"),
    type: z.enum(fieldTypeValues).describe("Field type"),
    formId: z.uuid().describe("Form ID this field belongs to"),
})

export type CreateFiledInputType = z.infer<typeof createFiledInput>

export const getFiledInput = z.object({
    id: z.uuid().describe("Field ID"),
})

export type GetFiledInputType = z.infer<typeof getFiledInput>

export const updateFiledInput = z.object({
    id: z.uuid().describe("Field ID"),
    label: z.string().min(1).max(100).optional().describe("Human readable field label"),
    description: z.string().max(5000).optional().describe("Optional field description"),
    placeholder: z.string().max(500).optional().describe("Optional placeholder text"),
    isRequired: z.boolean().optional().describe("Whether the field is required"),
    index: z.number().min(0).optional().describe("Fractional sort index for field ordering"),
    type: z.enum(fieldTypeValues).optional().describe("Field type"),
})

export type UpdateFiledInputType = z.infer<typeof updateFiledInput>

export const deleteFiledInput = z.object({
    id: z.uuid().describe("Field ID"),
})

export type DeleteFiledInputType = z.infer<typeof deleteFiledInput>
