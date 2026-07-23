import { db, desc, eq } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import {
    CreateFormInputType,
    ListFormsByUserIdInputType,
    createFormInput,
    listFormsByUserIdInput,
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
}

export default formService;
