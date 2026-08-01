import { formFiledService, formService, formSubmissionService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
    createFiledInputModel,
    createFiledOutputModel,
    createFormInputModel,
    createFormOutputModel,
    deleteFiledInputModel,
    deleteFiledOutputModel,
    getFiledInputModel,
    getFiledOutputModel,
    getFormInputModel,
    getFormOutputModel,
    listFormsOutputModel,
    updateFiledInputModel,
    updateFiledOutputModel,
    listFiledsInputModel,  
    listFiledsOutputModel, 
    submitFormInputModel,
    submitFormOutputModel,
    getFormSubmissionsInputModel,
    getFormSubmissionsOutputModel,
} from "./model"
import {z} from "zod"

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({

    createForm : authenticatedProcedure
    .meta({
        openapi : {
            method : "POST" ,
            path : getPath("/createForm") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input , ctx }) => {
        const { title , description } = input

        const { id } = await formService.createForm({
            title ,
            description ,
            createdBy : ctx.user.id ,
        })

        return {
            id ,
        }
    }) ,

    listForms : authenticatedProcedure
    .meta({
        openapi : {
            method : "GET" ,
            path : getPath("/listForms") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(z.undefined())
    .output(listFormsOutputModel)
    .query(async ({ ctx }) => {
        const forms = formService.listFormsByUserId({
            userId : ctx.user.id ,
        })
        return forms
    }) ,

    getFormById : publicProcedure
    .meta({
        openapi : {
            method : "GET" ,
            path : getPath("/getFormById") ,
            tags : TAGS ,
        }
    })
    .input(getFormInputModel)
    .output(getFormOutputModel)
    .query(async ({ input }) => {
        return formService.getFormById(input)
    }) ,

    submitForm : publicProcedure
    .meta({
        openapi : {
            method : "POST" ,
            path : getPath("/submitForm") ,
            tags : TAGS ,
        }
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
        return formSubmissionService.submitForm(input)
    }) ,

    getFormSubmissions : authenticatedProcedure
    .meta({
        openapi : {
            method : "GET" ,
            path : getPath("/getFormSubmissions") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(getFormSubmissionsInputModel)
    .output(getFormSubmissionsOutputModel)
    .query(async ({ input, ctx }) => {
        const submissions = await formSubmissionService.getFormSubmissions(input)

        return submissions.filter((submission) => submission.formId === input.formId)
    }) ,

    createFiled : authenticatedProcedure
    .meta({
        openapi : {
            method : "POST" ,
            path : getPath("/createFiled") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(createFiledInputModel)
    .output(createFiledOutputModel)
    .mutation(async ({ input }) => {
        const { id } = await formFiledService.createFiled(input)

        return {
            id ,
        }
    }) ,

    getFiled : authenticatedProcedure
    .meta({
        openapi : {
            method : "GET" ,
            path : getPath("/getFiled") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(getFiledInputModel)
    .output(getFiledOutputModel)
    .query(async ({ input }) => {
        const result = await formFiledService.getFiled(input)

        return result
    }) ,

    updateFiled : authenticatedProcedure
    .meta({
        openapi : {
            method : "PATCH" ,
            path : getPath("/updateFiled") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(updateFiledInputModel)
    .output(updateFiledOutputModel)
    .mutation(async ({ input }) => {
        const { id } = await formFiledService.updateFiled(input)

        return {
            id ,
        }
    }) ,

    deleteFiled : authenticatedProcedure
    .meta({
        openapi : {
            method : "DELETE" ,
            path : getPath("/deleteFiled") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(deleteFiledInputModel)
    .output(deleteFiledOutputModel)
    .mutation(async ({ input }) => {
        const { id } = await formFiledService.deleteFiled(input)

        return {
            id ,
        }
    }) ,

    listFileds : authenticatedProcedure
    .meta({
        openapi : {
            method : "GET" ,
            path : getPath("/listFileds") ,
            tags : TAGS ,
            protect : true
        }
    })
    .input(listFiledsInputModel)
    .output(listFiledsOutputModel)
    .query(async ({ input }) => {
        const result = await formFiledService.listFiledsByFormId(input)
        return result
    }) ,
})
