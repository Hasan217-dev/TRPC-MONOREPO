import {db} from "@repo/database"
import {formTable} from "@repo/database/models/form"

import {
    createFormInput ,
    type CreateFormInputType

} from "./model"

export default class UserService {
    public async createForm(paylaod :CreateFormInputType){
        const {title , description , createdBy} = await createFormInput.parseAsync(paylaod);
          
        const result = await db.insert(formTable).values({
            title,
            description,
            createdBy
        }).returning({
            id : formTable.id
        });

        if(!result || result.length === 0 || !result[0]?.id){
            throw new Error("Something went wrong while creating the form")
        }

        return {
            id : result[0].id
        }
    }
}