// Next
import { cacheTag } from "next/cache";
// Drizzle
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobInfos } from "@/drizzle/schema";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Ai
import { analyzeResumeForJob } from "@/services/resumes/ai";
// Lib
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast";
// Permissions
import { canRunResumeAnalysis } from "@/features/resume/permissions";
// Cache
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";

const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

export async function POST(req: Request) {
    const { userId } = await getCurrentUser();

    if (userId == null) {
        return new Response("You are not logged in", { status: 401 });
    }

    const formData = await req.formData();
    const resumeFile = formData.get("resumeFile") as File;
    const jobInfoId = formData.get("jobInfoId") as string;

    if (!resumeFile || !jobInfoId) {
        return new Response("Invalid request", { status: 400 });
    }

    if (resumeFile.size > 10 * 1024 * 1024) {
        return new Response("حجم فایل نباید از 10 مگ بیشتر باشد", {
            status: 400,
        });
    }

    if (!allowedTypes.includes(resumeFile.type)) {
        return new Response("لطفاً یک فایل PDF، Word یا متنی آپلود کنید", {
            status: 400,
        });
    }

    const jobInfo = await getJobInfo(jobInfoId, userId);
    if (jobInfo == null) {
        return new Response("شما اجازه دسترسی به این کار را ندارید", {
            status: 403,
        });
    }

    if (!(await canRunResumeAnalysis())) {
        return new Response(PLAN_LIMIT_MESSAGE, { status: 403 });
    }

    const res = await analyzeResumeForJob({
        resumeFile,
        jobInfo,
    });

    return res.toTextStreamResponse();
}

async function getJobInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    return db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, id), eq(JobInfos.userId, userId)),
    });
}
