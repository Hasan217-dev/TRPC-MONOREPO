import {publicProcedure , router} from "../../trpc"
import {
    createUserWithEmailAndPasswordInputModel , 
    createUserWithEmailAndPasswordOutputModel,
    signInUserWithEmailAndPasswordInputModel ,
    signInUserWithEmailAndPasswordOutputModel
    
} from "./model"
import { userService } from "../../services"

import {generatePath} from "../../utils/path-generator"
const getPath = generatePath("/authentication")
const TAGS =  ["Authentication"]

export const authRouter = router({
    createUserWithEmailAndPassword : publicProcedure
    .meta({
        method : "POST" ,
        path : getPath("/createUserWithEmailAndPassword"),
        tags : TAGS,
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({input , ctx})=> {
        const {fullName , email , password} = input;

       const {id , token} = await userService.createUserWithEmailAndPassword({
            fullName , email , password
        });

        ctx.setCookie("token" , token , {
            httpOnly : true,
            secure : false ,
            sameSite : "strict",
            maxAge : 30 * 24 * 60 * 60 * 1000,
        });

        return {
            id
        }
    }),

    signInUserWithEmailAndPassword : publicProcedure
    .meta({
        method : "POST" ,
        path : getPath("/signInUserWithEmailAndPassword"),
        tags : TAGS,
    })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({input , ctx})=> {
        const {email , password} = input;

        const {id , token} = await userService.signInUserWithEmailAndPassword({
            email , password
        });

        ctx.setCookie("token" , token , {
            httpOnly : true,
            secure : false ,
            sameSite : "strict",
            maxAge : 30 * 24 * 60 * 60 * 1000,
        });

        return {
            id
        }
    })
});