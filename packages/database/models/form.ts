import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const formTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 50 }).notNull(),
    description: varchar("description", { length: 300 }),

    createdBy: uuid("created_by").references(() => userTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
