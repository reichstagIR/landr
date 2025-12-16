// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Drizzle
import { db } from "@/drizzle/db";
import { Interview } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
// Cache
import { getInterviewIdTag } from "@/features/interviews/dbCache";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
// Next
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
// Component
import { BackLink } from "@/components/BackLink";
import { SuspendedItem } from "@/components/SuspendedItem";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Skeleton } from "@/components/Skeleton";
// Lib
import { formatDateTime } from "@/lib/formatter";
// ShadCn
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
// React
import { Suspense } from "react";
// Icon
import { Loader2Icon } from "lucide-react";
// Hume
import { CondensedMessages } from "@/services/hume/components/CondensedMessages";
import { condenseChatMessages } from "@/services/hume/lib/condenseChatMessages";
import { fetchChatMessages } from "@/services/hume/lib/api";
// Feature
import { generateInterviewFeedback } from "@/features/interviews/actions";

type TInterviewPageProps = {
    params: Promise<{
        jobInfoId: string;
        interviewId: string;
    }>;
};

type TMessagesProps = {
    interview: Promise<{ humeChatId: string | null }>;
};

export default async function InterviewPage({ params }: TInterviewPageProps) {
    const { interviewId, jobInfoId } = await params;

    const interview = getCurrentUser().then(
        async ({ redirectToSignIn, userId }) => {
            if (!userId) return redirectToSignIn();

            const interview = await getInterview(interviewId, userId);

            if (interview == null) return notFound();

            return interview;
        }
    );

    return (
        <div className="container my-4 space-y-4">
            <BackLink href={`/app/job-infos/${jobInfoId}/interviews`}>
                همه مصاحبه ها
            </BackLink>
            <div className="space-y-6">
                <div className="flex gap-2 justify-between">
                    <div className="space-y-2 mb-6">
                        <h1 className="text-3xl md:text-4xl">
                            مصاحبه:{" "}
                            <SuspendedItem
                                item={interview}
                                fallback={<Skeleton className="w-48" />}
                                result={(i) => formatDateTime(i.createAt)}
                            />
                        </h1>
                        <p className="text-muted-foreground">
                            <SuspendedItem
                                item={interview}
                                fallback={<Skeleton className="w-24" />}
                                result={(i) => i.duration}
                            />
                        </p>
                    </div>
                    <SuspendedItem
                        item={interview}
                        fallback={<Skeleton className="w-32" />}
                        result={(i) =>
                            i.feedback === null ? (
                                <ActionButton
                                    action={generateInterviewFeedback.bind(
                                        null,
                                        i.id
                                    )}
                                >
                                    ایجاد فیدبک
                                </ActionButton>
                            ) : (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>مشاهده فیدبک</Button>
                                    </DialogTrigger>
                                    <DialogContent className="md:max-w-3xl lg:max-w-4xl max-h-[calc(100%-2rem)] overflow-y-auto flex flex-col">
                                        <DialogHeader>
                                            <DialogTitle>بازخورد</DialogTitle>
                                        </DialogHeader>
                                        <MarkdownRenderer>
                                            {i.feedback}
                                        </MarkdownRenderer>
                                    </DialogContent>
                                </Dialog>
                            )
                        }
                    />
                </div>
            </div>
            <Suspense
                fallback={
                    <Loader2Icon className="animate-spin size-24 mx-auto" />
                }
            >
                <Messages interview={interview} />
            </Suspense>
        </div>
    );
}

async function Messages({ interview }: TMessagesProps) {
    const { user, redirectToSignIn } = await getCurrentUser({ allData: true });

    if (!user) {
        return redirectToSignIn();
    }

    const { humeChatId } = await interview;

    if (!humeChatId) return notFound();

    const condensedMessages = condenseChatMessages(
        await fetchChatMessages(humeChatId)
    );

    return (
        <CondensedMessages
            messages={condensedMessages}
            user={user}
            className="max-w-5xl mx-auto"
        />
    );
}

async function getInterview(id: string, userId: string) {
    "use cache";
    cacheTag(getInterviewIdTag(id));

    const interview = await db.query.Interview.findFirst({
        where: eq(Interview.id, id),
        with: {
            jobInfo: {
                columns: {
                    id: true,
                    userId: true,
                },
            },
        },
    });

    if (interview == null) return null;

    cacheTag(getJobInfoIdTag(interview.jobInfo.id));
    if (interview.jobInfo.userId !== userId) return null;

    return interview;
}
