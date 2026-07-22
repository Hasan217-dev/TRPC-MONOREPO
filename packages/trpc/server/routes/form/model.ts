import { z } from "zod"

const fieldTypeValues = ["TEXT", "NUMBER", "YES_NO", "EMAIL", "PASSWORD"] as const

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

export const createFiledInputModel = z.object({
    label : z.string().min(1).max(100).describe("Human readable field label"),
    description : z.string().max(5000).optional().describe("Optional field description"),
    placeholder : z.string().max(500).optional().describe("Optional placeholder text"),
    isRequired : z.boolean().optional().default(false).describe("Whether the field is required"),
    index : z.number().min(0).describe("Fractional sort index for field ordering"),
    type : z.enum(fieldTypeValues).describe("Field type"),
    formId : z.uuid().describe("Form ID this field belongs to"),
})

export const createFiledOutputModel = z.object({
    id : z.string().describe("id of the field created"),
})

export const getFiledInputModel = z.object({
    id : z.uuid().describe("Field ID"),
})

export const getFiledOutputModel = z.object({
    id : z.string().describe("id of the field"),
    label : z.string().describe("Human readable field label"),
    labelKey : z.string().describe("Stable slug key for the field"),
    description : z.string().nullable().optional().describe("Optional field description"),
    placeholder : z.string().nullable().optional().describe("Optional placeholder text"),
    isRequired : z.boolean().describe("Whether the field is required"),
    index : z.string().describe("Fractional sort index for field ordering"),
    type : z.enum(fieldTypeValues).describe("Field type"),
    formId : z.string().nullable().optional().describe("Form ID this field belongs to"),
    createdAt : z.date().nullable().optional().describe("date when the field was created"),
    updatedAt : z.date().nullable().optional().describe("date when the field was last updated"),
})

export const updateFiledInputModel = z.object({
    id : z.uuid().describe("Field ID"),
    label : z.string().min(1).max(100).optional().describe("Human readable field label"),
    description : z.string().max(5000).optional().describe("Optional field description"),
    placeholder : z.string().max(500).optional().describe("Optional placeholder text"),
    isRequired : z.boolean().optional().describe("Whether the field is required"),
    index : z.number().min(0).optional().describe("Fractional sort index for field ordering"),
    type : z.enum(fieldTypeValues).optional().describe("Field type"),
})

export const updateFiledOutputModel = z.object({
    id : z.string().describe("id of the field updated"),
})

export const deleteFiledInputModel = z.object({
    id : z.uuid().describe("Field ID"),
})

export const deleteFiledOutputModel = z.object({
    id : z.string().describe("id of the field deleted"),
})
