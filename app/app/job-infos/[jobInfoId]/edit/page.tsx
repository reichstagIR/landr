// ShadCn
import { Card, CardContent } from "@/components/ui/card";
// Component
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";
import { JobInfoBackLink } from "@/features/jobInfos/components/JobInfoBackLink";
// React
import { Suspense } from "react";
// Icon
import { Loader2 } from "lucide-react";
// Cache
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Next
import { notFound } from "next/navigation";
import { cacheTag } from "next/cache";
// Drizzle
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { JobInfos } from "@/drizzle/schema";

interface IJobInfoEditPageProps {
    params: Promise<{ jobInfoId: string }>;
}

export default async function JobInfoEditPage({
    params,
}: IJobInfoEditPageProps) {
    const { jobInfoId } = await params;

    return (
        <div className="container my-4 max-w-5xl space-y-4">
            <JobInfoBackLink jobInfoId={jobInfoId} />
            <h1 className="text-3xl md:text-4xl">ویرایش اطلاعات شغل</h1>

            <Card>
                <CardContent>
                    <Suspense
                        fallback={
                            <Loader2 className="size-24 animate-spin mx-auto" />
                        }
                    >
                        <SuspendedForm jobInfoId={jobInfoId} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}

async function SuspendedForm({ jobInfoId }: { jobInfoId: string }) {
    const { userId, redirectToSignIn } = await getCurrentUser();
    if (userId == null) return redirectToSignIn();

    const jobInfo = await getJobInfo(jobInfoId, userId);
    if (jobInfo == null) return notFound();

    return <JobInfoForm jobInfo={jobInfo} />;
}

async function getJobInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    return db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, id), eq(JobInfos.userId, userId)),
    });
}
