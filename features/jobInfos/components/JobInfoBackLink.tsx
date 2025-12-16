// Component
import { BackLink } from "@/components/BackLink";
// Drizzle
import { db } from "@/drizzle/db";
import { JobInfos } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
// Lib
import { cn } from "@/lib/utils";
// Next
import { cacheTag } from "next/cache";
// React
import { Suspense } from "react";
// Cache
import { getJobInfoIdTag } from "../dbCache";

interface IJobInfoBackLinkProps {
    jobInfoId: string;
    className?: string;
}

export function JobInfoBackLink({
    jobInfoId,
    className,
}: IJobInfoBackLinkProps) {
    return (
        <BackLink
            href={`/app/job-infos/${jobInfoId}`}
            className={cn("mb-4", className)}
        >
            <Suspense fallback="توضیحات شغل">
                <JobName jobInfoId={jobInfoId} />
            </Suspense>
        </BackLink>
    );
}

async function JobName({ jobInfoId }: { jobInfoId: string }) {
    const jobInfo = await getJobInfo(jobInfoId);
    return jobInfo?.name ?? "توضیحات شغل";
}

async function getJobInfo(id: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    return db.query.JobInfos.findFirst({
        where: eq(JobInfos.id, id),
    });
}
