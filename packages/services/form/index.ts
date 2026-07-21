import { db } from "@repo/database"
import { formsTable } from "@repo/database/models/form"
import {
    CreateFormInputType,
    createFormInput,
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
}

export default formService;
