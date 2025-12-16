// Drizzle
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createAt, id, updateAt } from "../schemaHelper";
// Schema
import { relations } from "drizzle-orm";
import { JobInfos } from "./jobInfos";

export const questionDifficulties = ["easy", "medium", "hard"] as const;

export type TQuestionDifficulties = (typeof questionDifficulties)[number];

export const questionDifficultiesEnum = pgEnum(
    "questions_question_difficulties",
    questionDifficulties
);

export const Questions = pgTable("questions", {
    id: id,
    jobInfoId: uuid()
        .references(() => JobInfos.id, { onDelete: "cascade" })
        .notNull(),
    text: varchar().notNull(),
    difficulty: questionDifficultiesEnum().notNull(),
    createAt,
    updateAt,
});

export const questionsRelations = relations(Questions, ({ one }) => ({
  jobInfo: one(JobInfos, {
    fields: [Questions.jobInfoId],
    references: [JobInfos.id],
  }),
}))
