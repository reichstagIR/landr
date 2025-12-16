// Drizzle
import { db } from "@/drizzle/db";
import { JobInfos, Questions } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { hasPermission } from "@/services/clerk/lib/hasPermissions";

export async function canCreateQuestion() {
    return await Promise.any([
        hasPermission("unlimited_questions").then(
            (bool) => bool || Promise.reject()
        ),
        Promise.all([
            hasPermission("5_questions"),
            getUserQuestionCount(),
        ]).then(([has, c]) => {
            if (has && c < 5) return true;
            return Promise.reject();
        }),
    ]).catch(() => false);
}

async function getUserQuestionCount() {
    const { userId } = await getCurrentUser();
    if (userId == null) return 0;

    return getQuestionCount(userId);
}

async function getQuestionCount(userId: string) {
    const [{ count: c }] = await db
        .select({ count: count() })
        .from(Questions)
        .innerJoin(JobInfos, eq(Questions.jobInfoId, JobInfos.id))
        .where(eq(JobInfos.userId, userId));

    return c;
}
