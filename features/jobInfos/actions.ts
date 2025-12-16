"use server";

// Zod
import z from "zod";
// Drizzle
import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { JobInfos } from "@/drizzle/schema";
import { jobInfoSchema } from "./schemas";
import { cacheTag } from "next/cache";
// Services
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Next
import { redirect } from "next/navigation";
// Action
import { insertJobInfos, updateJobInfos as updateJobInfosDB } from "./db";
// Cache
import { getJobInfoIdTag } from "./dbCache";

export async function createJobInfos(userData: z.infer<typeof jobInfoSchema>) {
    const { userId } = await getCurrentUser();

    if (userId === null) {
        return {
            error: true,
            message: "اجازه انجام این کار را ندارید!",
        };
    }

    const { success, data } = jobInfoSchema.safeParse(userData);

    if (!success) {
        return {
            error: true,
            message: "اطلاعات شغل نامعتبر است!",
        };
    }

    const jobInfo = await insertJobInfos({
        ...data,
        userId,
    });

    redirect(`/app/job-infos/${jobInfo.id}`);
}

export async function updateJobInfos(
    id: string,
    userData: z.infer<typeof jobInfoSchema>
) {
    const { userId } = await getCurrentUser();

    if (userId === null) {
        return {
            error: true,
            message: "اجازه انجام این کار را ندارید!",
        };
    }

    const { success, data } = jobInfoSchema.safeParse(userData);

    if (!success) {
        return {
            error: true,
            message: "اطلاعات شغل نامعتبر است!",
        };
    }

    const existingJobInfo = await getJobInfo(id, userId);

    if (existingJobInfo === null) {
        return {
            error: true,
            message: "اجازه انجام این کار را ندارید!",
        };
    }

    const jobInfo = await updateJobInfosDB(id, data);

    redirect(`/app/job-infos/${jobInfo.id}`);
}

async function getJobInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    const jobInfo = await db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, id), eq(JobInfos.userId, userId)),
    });

    return jobInfo;
}
