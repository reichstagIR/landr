// Component
import { JobInfoBackLink } from "@/features/jobInfos/components/JobInfoBackLink";
// Drizzle
import { db } from "@/drizzle/db";
import { Interview } from "@/drizzle/schema";
import { and, desc, eq, isNotNull } from "drizzle-orm";
// Icon
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/cache";
// React
import { Suspense } from "react";
// Cache
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { getInterviewJobInfoTag } from "@/features/interviews/dbCache";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Next
import { redirect } from "next/navigation";
import Link from "next/link";
//ShadCn
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// Lib
import { formatDateTime } from "@/lib/formatter";

interface IInterviewsPageProps {
    params: Promise<{ jobInfoId: string }>;
}

interface ISuspendedPageProps {
    jobInfoId: string;
}

export default async function InterviewsPage({ params }: IInterviewsPageProps) {
    const { jobInfoId } = await params;

    const { userId, redirectToSignIn } = await getCurrentUser();

    if (userId === null) {
        return redirectToSignIn();
    }

    const interviews = await getInterviews(jobInfoId, userId);

    if (interviews.length === 0) {
        return redirect(`/app/job-infos/${jobInfoId}/interviews/new`);
    }

    return (
        <div className="container gap-4 py-4 space-y-4 items-start h-screen-header flex flex-col">
            <JobInfoBackLink jobInfoId={jobInfoId} />

            <Suspense
                fallback={
                    <Loader2Icon className="size-24 animate-spin m-auto" />
                }
            >
                <SuspendedComponent jobInfoId={jobInfoId} />
            </Suspense>
        </div>
    );
}

async function SuspendedComponent({ jobInfoId }: ISuspendedPageProps) {
    const { userId, redirectToSignIn } = await getCurrentUser();
    if (userId == null) return redirectToSignIn();

    const interviews = await getInterviews(jobInfoId, userId);
    if (interviews.length === 0) {
        return redirect(`/app/job-infos/${jobInfoId}/interviews/new`);
    }

    return (
        <div className="space-y-6 w-full">
            <div className="flex gap-2 justify-between">
                <h1 className="text-3xl md:text-4xl lg:text-5xl">مصاحبه ها</h1>
                <Button asChild>
                    <Link href={`/app/job-infos/${jobInfoId}/interviews/new`}>
                        مصحابه جدید
                        <PlusIcon />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
                {interviews.map((interview) => (
                    <Link
                        className="hover:scale-[1.02] transition-[transform_opacity]"
                        href={`/app/job-infos/${jobInfoId}/interviews/${interview.id}`}
                        key={interview.id}
                    >
                        <Card className="h-full">
                            <div className="flex items-center justify-between h-full">
                                <CardHeader className="gap-1 grow">
                                    <CardTitle className="text-lg">
                                        {formatDateTime(interview.createAt)}
                                    </CardTitle>
                                    <CardDescription>
                                        {interview.duration}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ArrowLeftIcon className="size-6" />
                                </CardContent>
                            </div>
                        </Card>
                    </Link>
                ))}
                <Link
                    className="transition-opacity"
                    href={`/app/job-infos/${jobInfoId}/interviews/new`}
                >
                    <Card className="h-full flex items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none">
                        <div className="text-lg flex items-center gap-2">
                            مصاحبه جدید
                            <PlusIcon className="size-6" />
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

async function getInterviews(jobInfoId: string, userId: string) {
    "use cache";
    cacheTag(getInterviewJobInfoTag(jobInfoId));
    cacheTag(getJobInfoIdTag(jobInfoId));

    const data = await db.query.Interview.findMany({
        where: and(
            eq(Interview.jobInfoId, jobInfoId),
            isNotNull(Interview.humeChatId)
        ),
        with: {
            jobInfo: {
                columns: {
                    userId: true,
                },
            },
        },
        orderBy: desc(Interview.updateAt),
    });

    return data.filter((interview) => interview.jobInfo.userId === userId);
}
