import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,
  json
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";


export interface FormSubmissionValue {
    formFiledId : string 
    value : string
}

export type FormSubmissionValueRow = FormSubmissionValue[]

export const formSubmissonTable = pgTable("form_submission" , {
    id: uuid("id").primaryKey().defaultRandom(),

    formId : uuid("form_id").references(() => formsTable.id),
    
    values : json("values").$type<FormSubmissionValueRow>(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),

});