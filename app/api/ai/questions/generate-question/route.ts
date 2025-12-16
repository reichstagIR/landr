// Drizzle
import { db } from "@/drizzle/db";
import { JobInfos, questionDifficulties, Questions } from "@/drizzle/schema";
import { and, asc, eq } from "drizzle-orm";
// Cache
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { insertQuestion } from "@/features/questions/db";
import { getQuestionJobInfoTag } from "@/features/questions/dbCache";
// Permission
import { canCreateQuestion } from "@/features/questions/permissions";
// Lib
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast";
// Services
import { generateAiQuestion } from "@/services/ai/questions";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// AI
import { createDataStreamResponse } from "ai";
// Next
import { cacheTag } from "next/cache";
// Zod
import z from "zod";

const schema = z.object({
    prompt: z.enum(questionDifficulties),
    jobInfoId: z.string().min(1),
});

export async function POST(req: Request) {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
        return new Response("Error generating your question", { status: 400 });
    }

    const { prompt: difficulty, jobInfoId } = result.data;
    const { userId } = await getCurrentUser();

    if (userId == null) {
        return new Response("You are not logged in", { status: 401 });
    }

    if (!(await canCreateQuestion())) {
        return new Response(PLAN_LIMIT_MESSAGE, { status: 403 });
    }

    const jobInfo = await getJobInfo(jobInfoId, userId);
    if (jobInfo == null) {
        return new Response("You do not have permission to do this", {
            status: 403,
        });
    }

    const previousQuestions = await getQuestions(jobInfoId);

    return createDataStreamResponse({
        execute: async (dataStream) => {
            const res = generateAiQuestion({
                previousQuestions,
                jobInfo,
                difficulty,
                onFinish: async (question) => {
                    const { id } = await insertQuestion({
                        text: question,
                        jobInfoId,
                        difficulty,
                    });

                    dataStream.writeData({ questionId: id });
                },
            });
            res.mergeIntoDataStream(dataStream, { sendUsage: false });
        },
    });
}

async function getQuestions(jobInfoId: string) {
    "use cache";
    cacheTag(getQuestionJobInfoTag(jobInfoId));

    return db.query.Questions.findMany({
        where: eq(Questions.jobInfoId, jobInfoId),
        orderBy: asc(Questions.createAt),
    });
}

async function getJobInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    return db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, id), eq(JobInfos.userId, userId)),
    });
}
