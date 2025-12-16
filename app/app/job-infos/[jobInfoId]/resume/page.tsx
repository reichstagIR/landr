// Component
import { JobInfoBackLink } from "@/features/jobInfos/components/JobInfoBackLink";
import { ResumePageClient } from "./_client";
// React
import { Suspense } from "react";
// Icon
import { Loader2Icon } from "lucide-react";
// Next
import { redirect } from "next/navigation";
// Permissions
import { canRunResumeAnalysis } from "@/features/resume/permissions";

interface IResumePageProps {
    params: Promise<{ jobInfoId: string }>;
}

export default async function ResumePage({ params }: IResumePageProps) {
    const { jobInfoId } = await params;

    return (
        <div className="container py-4 space-y-4 h-screen-header flex flex-col items-start">
            <JobInfoBackLink jobInfoId={jobInfoId} />
            <Suspense
                fallback={
                    <Loader2Icon className="animate-spin size-24 m-auto" />
                }
            >
                <SuspendedComponent jobInfoId={jobInfoId} />
            </Suspense>
        </div>
    );
}

async function SuspendedComponent({ jobInfoId }: { jobInfoId: string }) {
    if (!(await canRunResumeAnalysis())) {
        redirect(`/app/upgrade`);
    }

    return <ResumePageClient jobInfoId={jobInfoId} />;
}
