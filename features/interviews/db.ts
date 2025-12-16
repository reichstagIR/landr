// Drizzle
import { db } from "@/drizzle/db";
import { Interview } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
// Cache
import { revalidateInterviewCache } from "./dbCache";

export async function insertInterview(
    interview: typeof Interview.$inferInsert
) {
    const [newInterview] = await db
        .insert(Interview)
        .values(interview)
        .returning({ id: Interview.id, jobInfoId: Interview.jobInfoId });

    revalidateInterviewCache(newInterview);

    return newInterview;
}

export async function updateInterview(
    id: string,
    interview: Partial<typeof Interview.$inferInsert>
) {
    const [newInterview] = await db
        .update(Interview)
        .set(interview)
        .where(eq(Interview.id, id))
        .returning({ id: Interview.id, jobInfoId: Interview.jobInfoId });

    revalidateInterviewCache(newInterview);

    return newInterview;
}
