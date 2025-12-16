// React
import { Suspense } from "react";
// Icon
import { Loader2Icon } from "lucide-react";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Next
import { cacheTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
// Cache
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
// Drizzle
import { db } from "@/drizzle/db";
import { JobInfos } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
// Hume
import { fetchAccessToken } from "hume";
import { VoiceProvider } from "@humeai/voice-react";
// Env
import { env } from "@/data/env/server";
// Component
import { StartCall } from "./_StartCall";
// Permissions
import { canCreateInterview } from "@/features/interviews/permissions";

interface INewInterviewPageProps {
    params: Promise<{ jobInfoId: string }>;
}

export default async function NewInterviewPage({
    params,
}: INewInterviewPageProps) {
    const { jobInfoId } = await params;

    return (
        <Suspense
            fallback={
                <div className="h-screen-header flex items-center justify-center">
                    <Loader2Icon className="size-24 animate-spin m-auto" />
                </div>
            }
        >
            <SuspendedComponent jobInfoId={jobInfoId} />
        </Suspense>
    );
}

async function SuspendedComponent({ jobInfoId }: { jobInfoId: string }) {
    const { redirectToSignIn, user, userId } = await getCurrentUser({
        allData: true,
    });

    if (!userId || !user) {
        return redirectToSignIn();
    }

    if (!(await canCreateInterview())) {
        return redirect("/app/upgrade");
    }

    const jobInfo = await getJobInfo(jobInfoId, userId);

    if (!jobInfo) {
        return notFound();
    }

    const accessToken = await fetchAccessToken({
        apiKey: env.HUME_API_KEY,
        secretKey: env.HUME_SECRET_KEY,
    });

    return (
        <VoiceProvider>
            <StartCall
                jobInfo={{
                    id: jobInfo.id,
                    experienceLevel: jobInfo.experienceLevel,
                    title: jobInfo.title,
                }}
                user={{
                    imageUrl: user.imageUrl,
                    name: user.name,
                }}
                accessToken={accessToken}
            />
        </VoiceProvider>
    );
}

async function getJobInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    return await db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, id), eq(JobInfos.userId, userId)),
    });
}
