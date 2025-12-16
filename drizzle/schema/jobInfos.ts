// Drizzle
import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { createAt, id, updateAt } from "../schemaHelper";
// Schema
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { Questions } from "./question";
import { Interview } from "./interview";

export const experienceLevel = ["junior", "mid-lever", "senior"] as const;

export type TExperienceLevel = (typeof experienceLevel)[number];

export const experienceLevelEnum = pgEnum(
    "job_infos_experience_level",
    experienceLevel
);

export const JobInfos = pgTable("job_infos", {
    id,
    userId: varchar()
        .references(() => UserTable.id, { onDelete: "cascade" })
        .notNull(),
    name: varchar().notNull(),
    title: varchar(),
    experienceLevel: experienceLevelEnum().notNull(),
    description: varchar().notNull(),
    createAt,
    updateAt,
});

export const jobInfosRelations = relations(JobInfos, ({ one, many }) => ({
    user: one(UserTable, {
        fields: [JobInfos.userId],
        references: [UserTable.id],
    }),
    questions: many(Questions),
    interview: many(Interview),
}));
