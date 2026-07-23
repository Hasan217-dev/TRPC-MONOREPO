import { formFiledService, formService } from "../../services";
import { authenticatedProcedure, router } from "../../trpc";
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
    listFormsOutputModel,
    updateFiledInputModel,
    updateFiledOutputModel,
    listFiledsInputModel,  
    listFiledsOutputModel, 
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
    }),


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
