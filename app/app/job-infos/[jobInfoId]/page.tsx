// Component
import { BackLink } from "@/components/BackLink";
import { SuspendedItem } from "@/components/SuspendedItem";
// ShadCn
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
// Drizzle
import { db } from "@/drizzle/db";
import { JobInfos } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
// Cache
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
// Lib
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatter";
// Icon
import { ArrowLeftIcon } from "lucide-react";
// Next
import { cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { Skeleton } from "@/components/Skeleton";

const options = [
    {
        label: "سوالات تخصصی",
        description: "خودت رو با سوالات تخصصی مربوط به شغلت به چالش بکش",
        href: "questions",
    },
    {
        label: "مصاحبه تمرینی",
        description: "خودت رو با مصاحبات تخصصی مربوط به شغلت به چالش بکش",
        href: "interviews",
    },
    {
        label: "برسی رزومه",
        description: "رزومه خودت رو برای شغل مورد نظرت بررسی کن",
        href: "resume",
    },
    {
        label: "ویرایش شغل",
        description: "تغییر مختصر توضیحات شغل انتخوابی",
        href: "edit",
    },
] as const;

interface JobInfoPageProps {
    params: Promise<{ jobInfoId: string }>;
}

export default async function JobInfoPage({ params }: JobInfoPageProps) {
    const { jobInfoId } = await params;

    const jobInfo = getCurrentUser().then(
        async ({ userId, redirectToSignIn }) => {
            if (userId === null) {
                return redirectToSignIn();
            }
            const jobInfo = await getJobInfo(jobInfoId, userId);
            if (!jobInfo) {
                return notFound();
            }
            return jobInfo;
        }
    );

    return (
        <div className="container my-4 space-y-4">
            <BackLink href="/app">داشبورد</BackLink>

            <div className="space-y-6">
                <header className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl">
                            <SuspendedItem
                                item={jobInfo}
                                result={(j) => j.name}
                                fallback={<Skeleton className="w-48" />}
                            />
                        </h1>
                        <div className="flex gap-2">
                            <Badge variant="secondary">
                                <SuspendedItem
                                    item={jobInfo}
                                    result={(j) =>
                                        formatExperienceLevel(j.experienceLevel)
                                    }
                                    fallback={<Skeleton className="w-32" />}
                                />
                            </Badge>
                            <SuspendedItem
                                item={jobInfo}
                                result={(j) => {
                                    return (
                                        j.title && (
                                            <Badge variant="secondary">
                                                {j.title}
                                            </Badge>
                                        )
                                    );
                                }}
                                fallback={null}
                            />
                        </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-3">
                        <SuspendedItem
                            item={jobInfo}
                            result={(j) => j.description}
                            fallback={<Skeleton className="w-96" />}
                        />
                    </p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
                    {options.map((option) => (
                        <Link
                            className="hover:scale-[1.02] transition-[transform_opacity]"
                            href={`/app/job-infos/${jobInfoId}/${option.href}`}
                            key={option.href}
                        >
                            <Card className="h-full flex items-start justify-between flex-row">
                                <CardHeader className="grow">
                                    <CardTitle>{option.label}</CardTitle>
                                    <CardDescription>
                                        {option.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ArrowLeftIcon className="size-6" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

async function getJobInfo(id: string, userId: string) {
    "use cache";
    cacheTag(getJobInfoIdTag(id));

    return await db.query.JobInfos.findFirst({
        where: and(eq(JobInfos.id, id), eq(JobInfos.userId, userId)),
    });
}
