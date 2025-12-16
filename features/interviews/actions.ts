"use server";

// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Next
import { cacheTag } from "next/cache";
// Cache
import { getJobInfoIdTag } from "../jobInfos/dbCache";
import { getInterviewIdTag } from "./dbCache";
// Drizzle
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { Interview, JobInfos } from "@/drizzle/schema";
// Actions
import { insertInterview, updateInterview as updateInterviewDB } from "./db";
// Permission
import { canCreateInterview } from "./permissions";
// Lib
import { PLAN_LIMIT_MESSAGE, RATE_LIMIT_MESSAGE } from "@/lib/errorToast";
// Arcject
import arcjet, { request, tokenBucket } from "@arcjet/next";
// Data
import { env } from "@/data/env/server";
// AI
import { generateAiInterviewFeedback } from "@/services/ai/interview";

interface ICreateInterview {
    jobInfoId: string;
}

interface IUpdateInterview {
    id: string;
    interview: {
        humeChatId?: string;
        duration?: string;
    };
}

type TCreateInterviewReturned = Promise<
    { error: true; message: string } | { error: false; id: string }
>;

// const aj = arcjet({
//     characteristics: ["userId"],
//     key: env.ARCJET_KEY,
//     rules: [
//         tokenBucket({
//             capacity: 12,
//             refillRate: 4,
//             interval: "1d",
//             mode: "LIVE",
//         }),
//     ],
// });

export async function createInterview({
    jobInfoId,
}: ICreateInterview): TCreateInterviewReturned {
    const { userId } = await getCurrentUser();

    if (!userId) {
        return {
            error: true,
            message: "شما اجازه ایجاد مصاحبه را ندارید!",
        };
    }

    // const decision = await aj.protect(await request(), {
    //     userId,
    //     requested: 1,
    // });

    // if (decision.isDenied()) {
    //     return {
    //         error: true,
    //         message: RATE_LIMIT_MESSAGE,
    //     };
    // }

    if (!(await canCreateInterview())) {
        return {
            error: true,
            message: PLAN_LIMIT_MESSAGE,
        };
    }

    const jobInfo = await getJobInfo(jobInfoId, userId);

    if (!jobInfo) {
        return {
            error: true,
            message: "شما اجازه ایجاد مصاحبه را ندارید!",
        };
    }

    const interview = await insertInterview({
        jobInfoId,
        duration: "00:00:00",
    });

    return { error: false, id: interview.id };
}

export async function updateInterview({
    id,
    interview: { duration, humeChatId },
}: IUpdateInterview) {
    const { userId } = await getCurrentUser();

    if (!userId) {
        return {
            error: true,
            message: "شما اجازه ایجاد مصاحبه را ندارید!",
        };
    }

    const interview = await getInterview(id, userId);

    if (!interview) {
        return {
            error: true,
            message: "شما اجازه ایجاد مصاحبه را ندارید!",
        };
    }

    await updateInterviewDB(id, { duration, humeChatId });

    return {
        error: false,
    };
}

export async function generateInterviewFeedback(interviewId: string) {
    const { userId, user } = await getCurrentUser({ allData: true });

    if (!userId || !user) {
        return {
            error: true,
            message: "شما اجازه ایجاد فیدبک را ندارید!",
        };
    }

    const interview = await getInterview(interviewId, userId);

    if (!interview) {
        return {
            error: true,
            message: "شما اجازه ایجاد فیدبک را ندارید!",
        };
    }

    if (!interview.humeChatId) {
        return {
            error: true,
            message: "شما اجازه ایجاد فیدبک را ندارید!",
        };
    }

    const feedback = await generateAiInterviewFeedback({
        humeChatId: interview.humeChatId,
        jobInfo: interview.jobInfo,
        userName: user.name,
    });

    if (!feedback) {
        return {
            error: true,
            message: "فیدبک ایجاد نشد!",
        };
    }

    await updateInterviewDB(interviewId, { feedback });

    
    
    return { error: false };
}

async function getJobInfo(jobInfoId: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(jobInfoId));

    const jobInfo = await db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, jobInfoId), eq(JobInfos.userId, userId)),
    });

    return jobInfo;
}

async function getInterview(id: string, userId: string) {
    "use cache";
    cacheTag(getInterviewIdTag(id));

    const interview = await db.query.Interview.findFirst({
        where: eq(Interview.id, id),
        with: {
            jobInfo: {
                columns: {
                    id: true,
                    userId: true,
                    description: true,
                    experienceLevel: true,
                    title: true,
                },
            },
        },
    });

    if (!interview) return null;

    cacheTag(getJobInfoIdTag(interview.jobInfo.id));

    if (interview.jobInfo.userId !== userId) {
        return null;
    }

    return interview;
}
