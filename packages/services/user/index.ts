import {db, eq} from "@repo/database"
import {usersTable} from "@repo/database/models/user"
import {randomBytes , createHmac} from "node:crypto"
import {CreateUserWithEmailAndPasswordInputType , createUserWithEmailAndPasswordInput}from "./model"

class userService {

    private async getUserByEmil(email : string){
     const result =  await db.select().from(usersTable).where(eq(usersTable.email , email))
     if(!result || result.length === 0) return null
     return result[0]
    }

    private async createUserWithEmailAndPassword(payload : CreateUserWithEmailAndPasswordInputType ){
         const {fullName , email , password} = await createUserWithEmailAndPasswordInput.parseAsync(payload)

         //check if the user exist or not
         const existingUserWithEmail = await this.getUserByEmil(email)
         if(existingUserWithEmail) throw new Error(`User with ${email} already exists`)

        //calculate salt and hash the password
         const salt = randomBytes(16).toString("hex")
         const hash = createHmac("sha256" , salt).update(password).digest("hex")
         
         //create userI in Db
         const userInsertResult = await db.insert(usersTable).values({fullName , email , password : hash , salt}).returning({
            id : usersTable.id
         });
         if(!userInsertResult || userInsertResult.length === 0) throw new Error(`something went wrong while creating the user`)

            return {
                id : userInsertResult[0]?.id
            }
    }
}

export default userService;