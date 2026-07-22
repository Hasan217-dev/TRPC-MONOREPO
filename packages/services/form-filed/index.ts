import { db, eq , asc} from "@repo/database"

import { formFieldsTable } from "@repo/database/models/form-field"
import {
    CreateFiledInputType,
    DeleteFiledInputType,
    GetFiledInputType,
    UpdateFiledInputType,
    createFiledInput,
    deleteFiledInput,
    getFiledInput,
    updateFiledInput,
} from "./model"

class formFiledService {
    private slugifyLabel(label: string) {
        return label
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
    }

   public async createFiled(payload: CreateFiledInputType) {
    const parsedPayload = await createFiledInput.parseAsync(payload)

    const { label, description, placeholder, isRequired, type, formId } = parsedPayload

    // Calculate next index server-side to avoid collisions
    const existingFields = await db
        .select({ id: formFieldsTable.id })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId))

    const nextIndex = existingFields.length + 1

    const result = await db.insert(formFieldsTable).values({
        label,
        labelKey: this.slugifyLabel(label),
        description,
        placeholder,
        isRequired,
        index: nextIndex.toString(),
        type,
        formId,
    }).returning({
        id: formFieldsTable.id,
    })

    if (!result || result.length === 0 || !result[0]?.id) {
        throw new Error("Something went wrong while creating the field")
    }

    return {
        id: result[0].id,
    }
}

    public async getFiled(payload: GetFiledInputType) {
        const { id } = await getFiledInput.parseAsync(payload)

        const result = await db.select().from(formFieldsTable).where(eq(formFieldsTable.id, id))

        if (!result || result.length === 0) {
            throw new Error(`Field with ID ${id} does not exist`)
        }

        return result[0]!
    }

    public async updateFiled(payload: UpdateFiledInputType) {
        const parsedPayload = await updateFiledInput.parseAsync(payload)

        const { id, ...fieldPayload } = parsedPayload

        const updateData: {
            label?: string
            description?: string | null
            placeholder?: string | null
            isRequired?: boolean
            index?: string
            type?: "TEXT" | "NUMBER" | "YES_NO" | "EMAIL" | "PASSWORD"
            updatedAt?: Date
        } = {}

        if (fieldPayload.label !== undefined) updateData.label = fieldPayload.label
        if (fieldPayload.description !== undefined) updateData.description = fieldPayload.description
        if (fieldPayload.placeholder !== undefined) updateData.placeholder = fieldPayload.placeholder
        if (fieldPayload.isRequired !== undefined) updateData.isRequired = fieldPayload.isRequired
        if (fieldPayload.index !== undefined) updateData.index = fieldPayload.index.toString()
        if (fieldPayload.type !== undefined) updateData.type = fieldPayload.type

        updateData.updatedAt = new Date()

        const result = await db.update(formFieldsTable)
            .set(updateData)
            .where(eq(formFieldsTable.id, id))
            .returning({
                id: formFieldsTable.id,
            })

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error(`Something went wrong while updating the field with ID ${id}`)
        }

        return {
            id: result[0].id,
        }
    }

    public async deleteFiled(payload: DeleteFiledInputType) {
        const { id } = await deleteFiledInput.parseAsync(payload)

        const result = await db.delete(formFieldsTable)
            .where(eq(formFieldsTable.id, id))
            .returning({
                id: formFieldsTable.id,
            })

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error(`Field with ID ${id} does not exist`)
        }

        return {
            id: result[0].id,
        }
    }

    public async listFiledsByFormId(payload: { formId: string }) {
    const { formId } = payload

    const result = await db
        .select()
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId))
        .orderBy(asc(formFieldsTable.index))

    return result
}
}

export default formFiledService
