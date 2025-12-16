// Drizzle
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createAt, id, updateAt } from "../schemaHelper";
// Schema
import { relations } from "drizzle-orm";
import { JobInfos } from "./jobInfos";

export const Interview = pgTable("interviews", {
    id,
    jobInfoId: uuid()
        .references(() => JobInfos.id, { onDelete: "cascade" })
        .notNull(),
    duration: varchar().notNull(),
    humeChatId: varchar(),
    feedback: varchar(),
    createAt,
    updateAt,
});

export const InterviewRelations = relations(Interview, ({ one }) => ({
  jobInfo: one(JobInfos, {
    fields: [Interview.jobInfoId],
    references: [JobInfos.id],
  }),
}))