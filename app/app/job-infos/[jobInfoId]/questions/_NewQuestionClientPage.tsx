"use client";

// Drizzle
import {
    JobInfos,
    questionDifficulties,
    TQuestionDifficulties,
} from "@/drizzle/schema";
// Component
import { BackLink } from "@/components/BackLink";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { LoadingSwap } from "@/components/ui/loading-swap";
// ShadCn
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// React
import { useMemo, useState } from "react";
// Features
import { formatQuestionDifficulty } from "@/features/questions/formatters";
// AI
import { useCompletion } from "@ai-sdk/react";
// Lib
import { errorToast } from "@/lib/errorToast";
// Zod
import z from "zod";

type TNewQuestionClientPageProps = {
    jobInfo: Pick<typeof JobInfos.$inferInsert, "id" | "title" | "name">;
};

type TStatus = "awaiting-answer" | "awaiting-difficulty" | "init";

type TQuestionContainerProps = {
    question: string | null;
    feedback: string | null;
    answer: string | null;
    status: TStatus;
    setAnswer: (value: string) => void;
};

type TControlsProps = {
    status: TStatus;
    isLoading: boolean;
    disableAnswerButton: boolean;
    reset: () => void;
    generateQuestion: (difficulty: TQuestionDifficulties) => void;
    generateFeedback: () => void;
};

export function NewQuestionClientPage({
    jobInfo,
}: TNewQuestionClientPageProps) {
    const [status, setStatus] = useState<TStatus>("init");
    const [answer, setAnswer] = useState<string | null>(null);

    const {
        complete: generateQuestion,
        completion: question,
        setCompletion: setQuestion,
        data,
        isLoading: isGeneratingQuestion,
    } = useCompletion({
        api: "/api/ai/questions/generate-question",
        onFinish: () => {
            setStatus("awaiting-answer");
        },
        onError(error) {
            errorToast(error.message);
        },
    });

    const {
        complete: generateFeedback,
        completion: feedback,
        setCompletion: setFeedback,
        isLoading: isGeneratingFeedback,
    } = useCompletion({
        api: "/api/ai/questions/generate-feedback",
        onFinish: () => {
            setStatus("awaiting-difficulty");
        },
        onError(error) {
            errorToast(error.message);
        },
    });

    const questionId = useMemo(() => {
        const item = data?.at(-1);
        if (item == null) return null;
        const parsed = z.object({ questionId: z.string() }).safeParse(item);
        if (!parsed.success) return null;

        return parsed.data.questionId;
    }, [data]);

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-[2000px] mx-auto grow h-screen-header">
            <div className="container flex gap-4 mt-4 items-center justify-center ">
                <div className="flex grow basis-0">
                    <BackLink href={`/app/job-infos/${jobInfo.id}`}>
                        {jobInfo.name}
                    </BackLink>
                </div>
                <Controls
                    status={status}
                    disableAnswerButton={
                        answer === null || answer.trim() === "" || !questionId
                    }
                    generateFeedback={() => {
                        if (!answer || answer.trim() === "") return;
                        generateFeedback(answer?.trim(), {
                            body: { questionId },
                        });
                    }}
                    generateQuestion={(difficulty) => {
                        setQuestion("");
                        setFeedback("");
                        setAnswer(null);
                        generateQuestion(difficulty, {
                            body: { jobInfoId: jobInfo.id },
                        });
                    }}
                    reset={() => {
                        setStatus("init");
                        setQuestion("");
                        setFeedback("");
                        setAnswer(null);
                    }}
                    isLoading={isGeneratingFeedback || isGeneratingQuestion}
                />
                <div className="grow hidden md:block" />
            </div>
            <QuestionContainer
                answer={answer}
                feedback={feedback}
                question={question}
                setAnswer={setAnswer}
                status={status}
            />
        </div>
    );
}

function Controls({
    status,
    isLoading,
    generateQuestion,
    generateFeedback,
    disableAnswerButton,
    reset,
}: TControlsProps) {
    return (
        <div className="flex gap-2">
            {status === "awaiting-answer" ? (
                <>
                    <Button
                        onClick={reset}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                    >
                        <LoadingSwap isLoading={isLoading}>ردکردن</LoadingSwap>
                    </Button>
                    <Button
                        onClick={generateFeedback}
                        disabled={disableAnswerButton}
                        size="sm"
                    >
                        <LoadingSwap isLoading={isLoading}>جواب</LoadingSwap>
                    </Button>
                </>
            ) : (
                questionDifficulties.map((difficulty) => (
                    <Button
                        onClick={() => {
                            generateQuestion(difficulty);
                        }}
                        key={difficulty}
                        size="sm"
                        disabled={isLoading}
                    >
                        <LoadingSwap isLoading={isLoading}>
                            {formatQuestionDifficulty(difficulty)}
                        </LoadingSwap>
                    </Button>
                ))
            )}
        </div>
    );
}

function QuestionContainer({
    answer,
    feedback,
    question,
    setAnswer,
    status,
}: TQuestionContainerProps) {
    return (
        <ResizablePanelGroup direction="horizontal" className="grow border-t">
            <ResizablePanel
                id="question-and-feedback"
                defaultSize={50}
                minSize={5}
            >
                <ResizablePanelGroup direction="vertical" className="grow">
                    <ResizablePanel id="question" defaultSize={25} maxSize={5}>
                        <ScrollArea className="h-full min-w-48 *:h-full">
                            {status === "init" && !question ? (
                                <p className="text-base md:text-lg flex items-center justify-center h-full p-6">
                                    با انتخاب سطح سختی شروع کنید
                                </p>
                            ) : (
                                question && (
                                    <div dir="rtl">
                                        <MarkdownRenderer className="p-6 text-right">
                                            {question}
                                        </MarkdownRenderer>
                                    </div>
                                )
                            )}
                        </ScrollArea>
                    </ResizablePanel>
                    {feedback && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel
                                id="feedback"
                                defaultSize={75}
                                maxSize={5}
                            >
                                <ScrollArea className="h-full min-w-48 *:h-full">
                                    <div dir="rtl">
                                        <MarkdownRenderer className="p-6 text-right">
                                            {feedback}
                                        </MarkdownRenderer>
                                    </div>
                                </ScrollArea>
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="answer" defaultSize={50} minSize={5}>
                <ScrollArea className="h-full min-w-48 *:h-full">
                    <Textarea
                        disabled={status !== "awaiting-answer"}
                        onChange={(event) => setAnswer(event.target.value)}
                        value={answer ?? ""}
                        placeholder="جواب خود را بنویسید"
                        className="w-full text-right h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset text-base"
                    />
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
