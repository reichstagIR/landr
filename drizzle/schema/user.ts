// Drizzle
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createAt, updateAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
// Schema
import { JobInfos } from "./jobInfos";

export const UserTable = pgTable("users", {
    id: varchar().primaryKey(),
    email: varchar().notNull().unique(),
    name: varchar().notNull(),
    imageUrl: varchar().notNull(),
    createAt,
    updateAt,
});

export const userTableRelations = relations(UserTable, ({ many }) => ({
    jobInfos: many(JobInfos),
}));
