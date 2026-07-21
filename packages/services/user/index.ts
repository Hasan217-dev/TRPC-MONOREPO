import {db, eq} from "@repo/database"
import * as JWT from "jsonwebtoken"
import {usersTable} from "@repo/database/models/user"
import {randomBytes , createHmac} from "node:crypto"    
import { env } from "../env"
import {
    CreateUserWithEmailAndPasswordInputType,
    GenerateUserTokenPayloadType,
    createUserWithEmailAndPasswordInput,
    generateUserTokenPayload,
    signInUserWithEmailAndPasswordInput,
    SignInUserWithEmailAndPasswordInputType,
}from "./model"

class userService {

    private async getUserByEmail(email : string){
     const result =  await db.select().from(usersTable).where(eq(usersTable.email , email))
     if(!result || result.length === 0) return null
     return result[0]
    }

    private async genrateUserToken(payload : GenerateUserTokenPayloadType){
        const {id} = await generateUserTokenPayload.parseAsync(payload)
        const token = JWT.sign({ id } , env.JWT_SECRET_KEY)
        return { token }
    }

    private async verifyUserToken(token : string) : Promise<GenerateUserTokenPayloadType>{
       try {
        const verificationResult = JWT.verify(token , env.JWT_SECRET_KEY) as GenerateUserTokenPayloadType
        return verificationResult
       } catch (error) {
         throw new Error(`Invalid Token`)
       }
    }

    public async getUserInfoById(id : string){
       const user = await db.select({
        id : usersTable.id,
        email : usersTable.email,
        fullName : usersTable.fullName,
        profileImageUrl : usersTable.profileImageUrl
       }).from(usersTable).where(eq(usersTable.id , id))

       if(!user || user.length === 0){
        throw new Error(`User with ID ${id} does not exists`)
       }

       return user[0]!
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

    public async signInUserWithEmailAndPassword(payload : SignInUserWithEmailAndPasswordInputType){
        const {email , password} = await signInUserWithEmailAndPasswordInput.parseAsync(payload)
        const existingUser = await this.getUserByEmail(email)
        if(!existingUser){
            throw new Error(`User with email ${email} does not exists`)
        }

        if(!existingUser.password || !existingUser.salt){
            throw new Error(`Invalid authentication method`)
        }

        const hash = createHmac('sha256' , existingUser.salt).update(password).digest("hex")
        if(hash !== existingUser.password){
            throw new Error(`Invalid Email or Passowrd`)
        }
        
        const {token} = await this.genrateUserToken({id : existingUser.id})

        return {
            token,
            id : existingUser.id
        }

    }

    public async verifyAndDecodeUserToken(token : string){
       const {id} = await this.verifyUserToken(token)
       return {id}
    }
}

export default userService