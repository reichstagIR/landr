// Drizzle
import { db } from "@/drizzle/db";
import { Questions } from "@/drizzle/schema";
// Cache
import { revalidateQuestionCache } from "./dbCache";

export async function insertQuestion(
    question: typeof Questions.$inferInsert
) {
    const [newQuestion] = await db
        .insert(Questions)
        .values(question)
        .returning({
            id: Questions.id,
            jobInfoId: Questions.jobInfoId,
        });

    revalidateQuestionCache({
        id: newQuestion.id,
        jobInfoId: newQuestion.jobInfoId,
    });

    return newQuestion;
}
