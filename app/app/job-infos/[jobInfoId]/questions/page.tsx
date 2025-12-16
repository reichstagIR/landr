// React
import { Suspense } from "react";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Permission
import { canCreateQuestion } from "@/features/questions/permissions";
// Next
import { notFound, redirect } from "next/navigation";
import { cacheTag } from "next/cache";
// Icon
import { Loader2Icon } from "lucide-react";
// Drizzle
import { JobInfos } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
// Cache
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
// Component
import { NewQuestionClientPage } from "./_NewQuestionClientPage";

type TQuestionPageProps = { params: Promise<{ jobInfoId: string }> };

type TSuspendedComponentProps = { jobInfoId: string };

export default async function QuestionPage({ params }: TQuestionPageProps) {
    const { jobInfoId } = await params;

    return (
        <Suspense
            fallback={
                <div className="h-screen-header flex items-center justify-center">
                    <Loader2Icon className="size-24 animate-spin" />
                </div>
            }
        >
            <SuspendedComponent jobInfoId={jobInfoId} />
        </Suspense>
    );
}

async function SuspendedComponent({ jobInfoId }: TSuspendedComponentProps) {
    const { userId, redirectToSignIn } = await getCurrentUser();

    if (!userId) {
        return redirectToSignIn();
    }

    if (!(await canCreateQuestion())) return redirect("/app/upgrade");

    const jobInfo = await getJobInfo(jobInfoId, userId);

    if (!jobInfo) {
        return notFound();
    }

    return <NewQuestionClientPage jobInfo={jobInfo} />;
}

async function getJobInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    return await db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, id), eq(JobInfos.userId, userId)),
    });
}
