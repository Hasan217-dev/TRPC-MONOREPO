import { 
    createUserWithEmailAndPassword,
    type CreateUserWithEmailAndPasswordType,
    generateUserTokenPayload ,
    type GenerateUserTokenPayloadType,
    signInUserWithEmailAndPassword,
    type SignInUserWithEmailAndPasswordType
     } from "./model";

import { db, eq } from "@repo/database";
import { userTable } from "@repo/database/models/user";

import bcrypt from "bcryptjs"
import * as JWT from "jsonwebtoken"
import {env} from "../env"

export default class userService {

    private async getUserByEmail(email: string) {
        const result = await db.select().from(userTable).where(eq(userTable.email, email));

        if (!result || result.length === 0) return null;
        return result[0];
    }

    private async generateUserToken(paylaod : GenerateUserTokenPayloadType ){
       const {id} = await generateUserTokenPayload.parseAsync(paylaod)

       const token = JWT.sign({id} , env.JWT_SECRET);

       return {token}
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordType) {
        const { fullName, email, password } =
            await createUserWithEmailAndPassword.parseAsync(payload);

        const existingUser = await this.getUserByEmail(email);
        if (existingUser) throw new Error("User with this email already exists");

        const passwordHash = await bcrypt.hash(password , 10)

        const result = await db
        .insert(userTable)
        .values({fullName , email , passwordHash})
        .returning({id : userTable.id})

        if(!result || result.length===0 || !result[0]?.id){
            throw new Error("some thing went wrong while creating a new user")
        }

        //token generate

       const {token} = await this.generateUserToken({id : result[0].id})
       
       return {
        id : result[0].id,
        token
       }
    }

    public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordType){
      const {email , password} =  await signInUserWithEmailAndPassword.parseAsync(payload)

      const existingUser = await this.getUserByEmail(email);
      if(!existingUser) throw new Error("User with this email does not exist");

      if(!existingUser.passwordHash){
        throw new Error("Invalid Authentication method");
      }

      const isValid = await bcrypt.compare(password , existingUser.passwordHash)
      if(!isValid) throw new Error("Invalid email address or password");

      const {token} = await this.generateUserToken({id : existingUser.id})

      return {
        id : existingUser.id,
        token
      }
    }
}
