import { db, desc, eq } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import {
    CreateFormInputType,
    GetFormByIdInputType,
    ListFormsByUserIdInputType,
    createFormInput,
    getFormByIdInput,
    listFormsByUserIdInput,
} from "./model"
import { formFieldsTable } from "@repo/database/models/form-field"

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

    // public async getFormById(payload : GetFormByIdInputType){
    //     const { id } = await getFormByIdInput.parseAsync(payload)

    //     const result = await db.select({
    //         id : formsTable.id,
    //         title : formsTable.title,
    //         description : formsTable.description,
    //         createdBy : formsTable.createdBy,
    //         createdAt : formsTable.createdAt,
    //         updatedAt : formsTable.updatedAt,
    //     }).from(formsTable)
    //     .leftJoin(formFieldsTable , eq(formFieldsTable.formId , formsTable.id))
    //     .where(eq(formsTable.id, id))

    //     if(!result || result.length === 0 || !result[0]){
    //         throw new Error(`Form with ID ${id} does not exist`)
    //     }

    //     return result[0]
    // }

    public async getFormById(payload: GetFormByIdInputType) {
    const { id } = await getFormByIdInput.parseAsync(payload)

    const result = await db.select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdBy: formsTable.createdBy,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,

        fieldId: formFieldsTable.id,
        fieldLabel: formFieldsTable.label,
        fieldType: formFieldsTable.type,
    })
    .from(formsTable)
    .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
    .where(eq(formsTable.id, id))

    if (!result || result.length === 0) {
        throw new Error(`Form with ID ${id} does not exist`)
    }

    return result
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
}

export default formService;
