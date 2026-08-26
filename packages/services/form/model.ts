import {z} from 'zod';

export const createFormInput = z.object({
    title : z.string().max(50).describe("Title of the form"),
    description : z.string().max(300).optional().describe("Description of the form"),
    createdBy : z.uuid("created_by").describe("UUID of the creator")
});

export type CreateFormInputType = z.infer<typeof createFormInput>;
