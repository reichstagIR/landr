"use client";

// Shadcn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
// Lib
import { cn } from "@/lib/utils";
import transformFlatArrayToCategory from "@/features/resume/lib/transformToCategory";
// Icon
import {
    AlertCircleIcon,
    CheckCircleIcon,
    UploadIcon,
    XCircleIcon,
} from "lucide-react";
import { DeepPartial } from "ai";
// React
import { ReactNode, useRef, useState } from "react";
// AI
import { experimental_useObject as useObject } from "@ai-sdk/react";
// Schema
import { aiAnalyzeSchema } from "@/services/resumes/schemas";
// Zod
import z from "zod";
// Component
import { Skeleton } from "@/components/Skeleton";

type TResumePageClientProps = {
    jobInfoId: string;
};

type TAnalysisResultProps = {
    aiAnalysis: DeepPartial<z.infer<typeof aiAnalyzeSchema>> | undefined;
    isLoading: boolean;
};

type TCategoryAccordionHeaderProps = {
    title: string;
    score: number | undefined | null;
};

type TFeedbackProps = Partial<
    z.infer<typeof aiAnalyzeSchema>["ats"]["feedback"][number]
>;

type TKeys = Exclude<keyof z.infer<typeof aiAnalyzeSchema>, "overallScore">;

const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

export function ResumePageClient({ jobInfoId }: TResumePageClientProps) {
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const fileRef = useRef<File | null>(null);

    const {
        object: aiAnalysis,
        isLoading,
        submit: generateAiAnalysis,
    } = useObject({
        api: "/api/ai/resume/analyze",
        schema: aiAnalyzeSchema,
        fetch: (url, option) => {
            const headers = new Headers(option?.headers);
            headers.delete("content-type");

            const formData = new FormData();

            if (fileRef.current) {
                formData.append("resumeFile", fileRef.current);
            }

            formData.append("jobInfoId", jobInfoId);

            return fetch(url, { ...option, headers, body: formData });
        },
    });

    const handleFileUpload = (file: File | null) => {
        fileRef.current = file;
        if (file === null) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("حجم فایل نباید بیشتر از 10 مگابایت باشد.");
        }

        if (!allowedTypes.includes(file.type)) {
            toast.error("فرمت فایل باید PDF, DOC, DOCX یا TXT باشد.");
            return;
        }

        generateAiAnalysis(null);
    };

    return (
        <div className="space-y-8 w-full">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {isLoading
                            ? "در حال آنالیز رزومه شما"
                            : "رزومه خود را آپلود کنید"}
                    </CardTitle>
                    <CardDescription>
                        {isLoading
                            ? "ممکن است مدتی طول بکشد"
                            : "یک فیدبک شخصی سازی شده درباره شغل خود دریافت کنید"}
                    </CardDescription>
                    <CardContent>
                        <LoadingSwap
                            loadingIconClassName="size-16"
                            isLoading={isLoading}
                        >
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(false);
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(false);
                                    handleFileUpload(
                                        e.dataTransfer.files?.[0] ?? null
                                    );
                                }}
                                className={cn(
                                    "mt-2 border-2 border-dashed rounded-lg p-6 transition-colors relative",
                                    isDragOver
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/50 bg-muted/10"
                                )}
                            >
                                <label
                                    htmlFor="resume-upload"
                                    className="sr-only"
                                >
                                    رزومه را آپلود کنید
                                </label>
                                <input
                                    id="resume-upload"
                                    type="file"
                                    accept=".pdf,.doc,docx,.txt"
                                    className="opacity-0 absolute inset-0 cursor-pointer"
                                    onChange={(e) => {
                                        handleFileUpload(
                                            e.currentTarget.files?.[0] ?? null
                                        );
                                    }}
                                />
                                <div className="flex flex-col items-center justify-center text-center gap-4">
                                    <UploadIcon className="size-12 text-muted-foreground" />
                                    <div className="space-y-2">
                                        <p className="text-lg">
                                            فایل روزمه را بکشید یا روی آپلود
                                            کیلیک کنید
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            فرمت های پذیرفته شده: PDF, DOC,
                                            DOCX, TXT
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </LoadingSwap>
                    </CardContent>
                </CardHeader>
            </Card>
            <AnalysisResult
                aiAnalysis={
                    aiAnalysis as
                        | DeepPartial<z.infer<typeof aiAnalyzeSchema>>
                        | undefined
                }
                isLoading={isLoading}
            />
        </div>
    );
}

function AnalysisResult({ aiAnalysis, isLoading }: TAnalysisResultProps) {
    if (isLoading === false && aiAnalysis == null) {
        return null;
    }

    const sections: Record<TKeys, string> = {
        ats: "تطابق با ATS",
        jobMatch: "تطابق شغلی",
        writingAndFormatting: "نگارش و قالب‌بندی",
        keywordCoverage: "پوشش کلمات کلیدی",
        other: "بینش‌های اضافی",
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>نتیجه آنالیز</CardTitle>
                <CardDescription>
                    {aiAnalysis?.overallScore == null ? (
                        <Skeleton className="w-32" />
                    ) : (
                        `Overall Score: ${aiAnalysis.overallScore}/10`
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple">
                    {Object.entries(sections).map(([key, title]) => {
                        const category = transformFlatArrayToCategory(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (aiAnalysis as any)?.[key] ?? []
                        ) as z.infer<typeof aiAnalyzeSchema>[TKeys] | null;

                        return (
                            <AccordionItem value={title} key={key}>
                                <AccordionTrigger>
                                    <CategoryAccordionHeader
                                        title={title}
                                        score={category?.score}
                                    />
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        <div
                                            dir="ltr"
                                            className="text-muted-foreground text-left"
                                        >
                                            {category?.summary == null ? (
                                                <span className="space-y-2">
                                                    <Skeleton />
                                                    <Skeleton className="w-3/4" />
                                                </span>
                                            ) : (
                                                category.summary
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {category?.feedback == null ? (
                                                <>
                                                    <Skeleton className="h-16" />
                                                    <Skeleton className="h-16" />
                                                    <Skeleton className="h-16" />
                                                </>
                                            ) : (
                                                category.feedback.map(
                                                    (item, index) => {
                                                        if (item == null)
                                                            return null;

                                                        return (
                                                            <FeedbackItem
                                                                key={index}
                                                                {...item}
                                                            />
                                                        );
                                                    }
                                                )
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </CardContent>
        </Card>
    );
}

function CategoryAccordionHeader({
    title,
    score,
}: TCategoryAccordionHeaderProps) {
    let badge: ReactNode;
    if (score == null) {
        badge = <Skeleton className="w-16" />;
    } else if (score >= 8) {
        badge = <Badge>بسیار عالی</Badge>;
    } else if (score >= 6) {
        badge = <Badge variant="warning">خوب</Badge>;
    } else {
        badge = <Badge variant="destructive">نیاز به بهبود</Badge>;
    }

    return (
        <div className="flex items-start justify-between w-full">
            <div className="flex flex-col items-start gap-1">
                <span>{title}</span>
                <div className="no-underline">{badge}</div>
            </div>
            {score == null ? <Skeleton className="w-12" /> : `${score}/10`}
        </div>
    );
}

function FeedbackItem({ message, name, type }: TFeedbackProps) {
    if (name == null || message == null || type == null) return null;

    const getColors = () => {
        switch (type) {
            case "strength":
                return "bg-primary/10 border border-primary/50";
            case "major-improvement":
                return "bg-destructive/10 dark:bg-destructive/20 border border-destructive/50 dark:border-destructive/70";
            case "minor-improvement":
                return "bg-warning/10 border border-warning/40";
            default:
                throw new Error(
                    `Unknown feedback type: ${type satisfies never}`
                );
        }
    };

    const getIcon = () => {
        switch (type) {
            case "strength":
                return <CheckCircleIcon className="size-4 text-primary" />;
            case "minor-improvement":
                return <AlertCircleIcon className="size-4 text-warning" />;
            case "major-improvement":
                return <XCircleIcon className="size-4 text-destructive" />;
            default:
                throw new Error(
                    `Unknown feedback type: ${type satisfies never}`
                );
        }
    };

    return (
        <div
            dir="ltr"
            className={cn(
                "flex items-baseline gap-3 pl-3 pr-5 py-5 rounded-lg",
                getColors()
            )}
        >
            <div>{getIcon()}</div>
            <div className="flex flex-col gap-1">
                <div className="text-base">{name}</div>
                <div className="text-muted-foreground">{message}</div>
            </div>
        </div>
    );
}
