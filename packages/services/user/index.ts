import {db, eq} from "@repo/database"
import * as JWT from "jsonwebtoken"
import {usersTable} from "@repo/database/models/user"
import {randomBytes , createHmac} from "node:crypto"    
import { env } from "../env"
import {
    CreateUserWithEmailAndPasswordInputType,
    GenerateUserTokenPayloadType,
    createUserWithEmailAndPasswordInput,
    generateUserTokenPayload
}from "./model"

class userService {

    private async getUserByEmail(email : string){
     const result =  await db.select().from(usersTable).where(eq(usersTable.email , email))
     if(!result || result.length === 0) return null
     return result[0]
    }

    private async genrateUserToken(payload : GenerateUserTokenPayloadType){
        const {id} = await generateUserTokenPayload.parseAsync(payload)
        const token = JWT.sign({id} , env.JWT_SECRET_KEY)
        return { token }
    }

    public async createUserWithEmailAndPassword(payload : CreateUserWithEmailAndPasswordInputType ){
         const {fullName , email , password} = await createUserWithEmailAndPasswordInput.parseAsync(payload)

         //check if the user exist or not
         const existingUserWithEmail = await this.getUserByEmail(email)
         if(existingUserWithEmail) throw new Error(`User with ${email} already exists`)

        //calculate salt and hash the password
         const salt = randomBytes(16).toString("hex")
         const hash = createHmac("sha256" , salt).update(password).digest("hex")
         
         //create user in Db
         const userInsertResult = await db.insert(usersTable).values({fullName , email , password : hash , salt}).returning({
            id : usersTable.id
         });
         
         if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error(`something went wrong while creating the user`)

            const userId  = userInsertResult[0].id
            const {token} = await this.genrateUserToken({id : userId})

            return {
                id : userId,
                token
            }
    }
}

export default userService