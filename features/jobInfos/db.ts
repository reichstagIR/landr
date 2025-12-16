// Drizzle
import { db } from "@/drizzle/db";
import { JobInfos } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
// Cache
import { revalidateJobInfo } from "./dbCache";

export async function insertJobInfos(jobInfo: typeof JobInfos.$inferInsert) {
    const [newJobInfo] = await db.insert(JobInfos).values(jobInfo).returning({
        id: JobInfos.id,
        userId: JobInfos.userId,
    });

    revalidateJobInfo(newJobInfo);

    return newJobInfo;
}

export async function updateJobInfos(
    id: string,
    jobInfo: Partial<typeof JobInfos.$inferInsert>
) {
    const [updatedJobInfo] = await db
        .update(JobInfos)
        .set(jobInfo)
        .where(eq(JobInfos.id, id))
        .returning({
            id: JobInfos.id,
            userId: JobInfos.userId,
        });

    revalidateJobInfo(updatedJobInfo);

    return updatedJobInfo;
}
