import { asc, db, desc, eq } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import { formFieldsTable } from "@repo/database/models/form-field"
import { formSubmissonTable } from "@repo/database/models/form-submisson"
import {
    CreateFormInputType,
    GetFormByIdInputType,
    ListFormsByUserIdInputType,
    SubmitFormInputType,
    createFormInput,
    getFormByIdInput,
    listFormsByUserIdInput,
    submitFormInput,
} from "./model"

class formService {

    public async createForm(payload : CreateFormInputType){
        const { title , description , createdBy } = await createFormInput.parseAsync(payload)

        const result = await db.insert(formsTable).values({
            title ,
            description ,
            createdBy ,
        }).returning({
            id : formsTable.id ,
        })

        if(!result || result.length === 0 || !result[0]?.id){
            throw new Error(`something went wrong while creating the form`)
        }

        const formId = result[0].id

        return {
            id : formId ,
        }
    }

    public async listFormsByUserId(payload : ListFormsByUserIdInputType){
        const { userId } = await listFormsByUserIdInput.parseAsync(payload)

        return db.select({
            id : formsTable.id,
            title : formsTable.title,
            description : formsTable.description,
            createdBy : formsTable.createdBy,
            createdAt : formsTable.createdAt,
            updatedAt : formsTable.updatedAt,
        }).from(formsTable)
        .where(eq(formsTable.createdBy, userId))
        .orderBy(desc(formsTable.createdAt))
    }

    public async getFormById(payload : GetFormByIdInputType){
        const { id } = await getFormByIdInput.parseAsync(payload)

        const formRows = await db.select({
            id : formsTable.id,
            title : formsTable.title,
            description : formsTable.description,
            createdBy : formsTable.createdBy,
            createdAt : formsTable.createdAt,
            updatedAt : formsTable.updatedAt,
            fieldId : formFieldsTable.id,
            label : formFieldsTable.label,
            labelKey : formFieldsTable.labelKey,
            fieldDescription : formFieldsTable.description,
            placeholder : formFieldsTable.placeholder,
            isRequired : formFieldsTable.isRequired,
            index : formFieldsTable.index,
            type : formFieldsTable.type,
            fieldFormId : formFieldsTable.formId,
            fieldCreatedAt : formFieldsTable.createdAt,
            fieldUpdatedAt : formFieldsTable.updatedAt,
        }).from(formsTable)
        .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
        .where(eq(formsTable.id, id))
        .orderBy(asc(formFieldsTable.index))

        const [firstRow] = formRows

        if(!firstRow){
            throw new Error(`form with id ${id} was not found`)
        }

        const fields = formRows
            .filter((row) => Boolean(row.fieldId))
            .map((row) => ({
                id : row.fieldId!,
                label : row.label!,
                labelKey : row.labelKey!,
                description : row.fieldDescription,
                placeholder : row.placeholder,
                isRequired : row.isRequired!,
                index : row.index ? String(row.index) : "0",
                type : row.type!,
                formId : row.fieldFormId,
                createdAt : row.fieldCreatedAt,
                updatedAt : row.fieldUpdatedAt,
            }))

        return {
            id : firstRow.id,
            title : firstRow.title,
            description : firstRow.description,
            createdBy : firstRow.createdBy,
            createdAt : firstRow.createdAt,
            updatedAt : firstRow.updatedAt,
            fields,
        }
    }

    public async submitForm(payload : SubmitFormInputType){
        const { formId, values } = await submitFormInput.parseAsync(payload)

        const result = await db.insert(formSubmissonTable).values({
            formId,
            values,
        }).returning({
            id : formSubmissonTable.id,
        })

        if(!result || result.length === 0 || !result[0]?.id){
            throw new Error("something went wrong while submitting the form")
        }

        return {
            id : result[0].id,
        }
    }
}

export default formService;
