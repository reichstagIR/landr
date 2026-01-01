// React
import { Suspense } from "react";
// Drizzle
import { db } from "@/drizzle/db";
import { desc, eq } from "drizzle-orm";
import { JobInfos as JobInfosTable } from "@/drizzle/schema";
// Actions
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Icon
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react";
// Features
import { getJobInfoUserTag } from "@/features/jobInfos/dbCache";
// Next
import { cacheTag } from "next/cache";
import Link from "next/link";
// ShadCn
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Components
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";
// Lib
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatter";
import InstallPrompt from "./_InstallPrompt";

export default function AppPage() {
    return (
        <Suspense fallback={<Loader />}>
            <JobInfos />
        </Suspense>
    );
}

function Loader() {
    return (
        <div className="h-screen-header flex items-center justify-center">
            <Loader2Icon className="size-24 animate-spin" />
        </div>
    );
}

async function JobInfos() {
    const { userId, redirectToSignIn } = await getCurrentUser();

    if (userId === null) {
        return redirectToSignIn();
    }

    const jobInfos = await getJobInfos(userId);

    if (jobInfos.length === 0) {
        return <NoJobInfos />;
    }

    return (
        <div className="container my-4">
            <InstallPrompt />
            <div className="flex gap-2 justify-between mb-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
                    اطلاعات شغل های شما
                </h1>
                <Button asChild>
                    <Link href="app/job-infos/new">
                        ایجاد توضحات شغل
                        <PlusIcon />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
                {jobInfos.map((jobInfo) => (
                    <Link
                        href={`/app/job-infos/${jobInfo.id}`}
                        key={jobInfo.id}
                        className="hover:scale-[1.02] transition-[transform_opacity]"
                    >
                        <Card className="h-full">
                            <div className="flex items-center justify-between h-full">
                                <div className="space-y-4 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {jobInfo.name}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="text-muted-foreground line-clamp-3">
                                        {jobInfo.description}
                                    </CardContent>

                                    <CardFooter className="flex gap-2">
                                        <Badge variant="outline">
                                            {formatExperienceLevel(
                                                jobInfo.experienceLevel
                                            )}
                                        </Badge>
                                        {jobInfo.title && (
                                            <Badge variant="outline">
                                                {jobInfo.title}
                                            </Badge>
                                        )}
                                    </CardFooter>
                                </div>
                                <CardContent>
                                    <ArrowLeftIcon className="size-6" />
                                </CardContent>
                            </div>
                        </Card>
                    </Link>
                ))}
                <Link className="transition-opacity" href="app/job-infos/new">
                    <Card className="h-full flex items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none">
                        <div className="text-lg flex items-center gap-2">
                            ایجاد شغل جدید
                            <PlusIcon className="size-6" />
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

function NoJobInfos() {
    return (
        <div className="container my-4 max-w-5xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
                به لندر خوش آمدید
            </h1>
            <p className="text-muted-foreground mb-8">
                برای شروع، اطلاعات مربوط به نوع شغلی که می‌خواهید برای آن
                درخواست دهید را وارد کنید. این می‌تواند اطلاعات خاصی باشد که
                مستقیماً از فهرست مشاغل کپی شده است یا اطلاعات عمومی مانند تخصص
                فنی که می‌خواهید در آن کار کنید. هرچه توضیحات دقیق‌تر باشد،
                مصاحبه‌های آزمایشی به واقعیت نزدیک‌تر خواهد بود.
            </p>
            <Card>
                <CardContent>
                    <JobInfoForm />
                </CardContent>
            </Card>
        </div>
    );
}

async function getJobInfos(userId: string) {
    "use cache";
    cacheTag(getJobInfoUserTag(userId));

    return db.query.JobInfos.findMany({
        where: eq(JobInfosTable.userId, userId),
        orderBy: desc(JobInfosTable.updateAt),
    });
}
