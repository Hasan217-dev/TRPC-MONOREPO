import {email, z} from "zod"

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName : z.string("").describe("FullName of the user"),
    email : z.email().describe("Email Address of the user"),
    password : z.string().describe("Password of the user")
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
   id : z.string().describe("id of the uset created")
});

export const signInUserWithEmailAndPasswordInputModel = z.object({
    email : z.string().describe("Email of the user"),
    password : z.string().describe("Password of the user")
});

export const signInUserWithEmailAndPasswordOutptModel = z.object({
    id : z.string().describe("id of the user")
});

export const getLoggedInUserInfoInputModel = z.undefined()

export const getLoggedInUserInfoOutputModel = z.object({
     id : z.string().describe("id of the user"),
     email : z.string().describe("Email of the user"),
      fullName : z.string().describe("Full Name of the user"),
      profileImageUrl : z.string().describe("image of the user").optional().nullable()
})

