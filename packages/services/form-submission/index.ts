import { db, eq } from "@repo/database"
import { formSubmissonTable } from "@repo/database/models/form-submisson"
import { GetFormSubmissionsInputType, SubmitFormInputType, getFormSubmissionsInput, submitFormInput } from "./model"

class formSubmissionService {
    public async submitForm(payload: SubmitFormInputType) {
        const { formId, values } = await submitFormInput.parseAsync(payload)

        const result = await db.insert(formSubmissonTable).values({
            formId,
            values,
        }).returning({
            id: formSubmissonTable.id,
        })

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error("something went wrong while submitting the form")
        }

        return {
            id: result[0].id,
        }
    }

    public async getFormSubmissions(payload: GetFormSubmissionsInputType) {
        const { formId } = await getFormSubmissionsInput.parseAsync(payload)

        return await db.
        select()
            .from(formSubmissonTable)
            .where(eq(formSubmissonTable.formId, formId))
            .orderBy(formSubmissonTable.createdAt)
    }
}

export default formSubmissionService
