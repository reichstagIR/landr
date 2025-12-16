"use client";

// Drizzle
import { JobInfos, UserTable } from "@/drizzle/schema";
// ShadCn
import { Button } from "@/components/ui/button";
// Hume
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
// Env
import { env } from "@/data/env/client";
// Icon
import { Loader2Icon, MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
// Lib
import { condenseChatMessages } from "@/services/hume/lib/condenseChatMessages";
// Component
import { CondensedMessages } from "@/services/hume/components/CondensedMessages";
// Action
import {
    createInterview,
    updateInterview,
} from "@/features/interviews/actions";
// Lib
import { errorToast } from "@/lib/errorToast";
// React
import { useState, useEffect, useRef } from "react";
// Next
import { useRouter } from "next/navigation";

interface IStartCallProps {
    jobInfo: Pick<
        typeof JobInfos.$inferSelect,
        "id" | "title" | "experienceLevel"
    >;
    accessToken: string;
    user: Pick<typeof UserTable.$inferSelect, "imageUrl" | "name">;
}

interface IMessagesProps {
    user: Pick<typeof UserTable.$inferSelect, "imageUrl" | "name">;
}

export function StartCall({ accessToken, jobInfo, user }: IStartCallProps) {
    const {
        connect,
        readyState,
        chatMetadata,
        callDurationTimestamp,
    } = useVoice();

    const [interviewId, setInterviewId] = useState<string | null>();

    const router = useRouter();

    const durationRef = useRef(callDurationTimestamp);
    // eslint-disable-next-line react-hooks/refs
    durationRef.current = callDurationTimestamp;

    useEffect(() => {
        if (!chatMetadata?.chatId || !interviewId) {
            return;
        }
        updateInterview({
            id: interviewId,
            interview: { humeChatId: chatMetadata?.chatId },
        });
    }, [chatMetadata?.chatId, interviewId]);

    useEffect(() => {
        if (readyState !== VoiceReadyState.CLOSED) return;
        if (!interviewId) {
            return router.push(`/app/job-infos/${jobInfo.id}/interviews`);
        }

        if (durationRef.current) {
            updateInterview({
                id: interviewId,
                interview: { duration: durationRef.current },
            });
        }

        router.push(`/app/job-infos/${jobInfo.id}/interviews/${interviewId}`);
    }, [interviewId, readyState, router, jobInfo.id]);

    useEffect(() => {
        if (!interviewId) {
            return;
        }

        const intervalId = setInterval(() => {
            if (!durationRef.current) {
                return null;
            }
            updateInterview({
                id: interviewId,
                interview: { duration: durationRef.current },
            });
        }, 10000);

        return () => clearInterval(intervalId);
    }, [interviewId]);

    if (readyState === VoiceReadyState.IDLE) {
        const onClickStartInterview = async () => {
            const res = await createInterview({ jobInfoId: jobInfo.id });

            if (res.error) {
                return errorToast(res.message);
            }
            setInterviewId(res.id);

            connect({
                auth: {
                    type: "accessToken",
                    value: accessToken,
                },
                configId: env.NEXT_PUBLIC_HUME_CONFIG_ID,
                sessionSettings: {
                    type: "session_settings",
                    variables: {
                        userName: user.name,
                        title: jobInfo.title || "Not specified",
                        experienceLevel: jobInfo.experienceLevel,
                    },
                },
            });
        };

        return (
            <div className="flex justify-center items-center h-screen-header">
                <Button size="lg" onClick={onClickStartInterview}>
                    شروع مصاحبه
                </Button>
            </div>
        );
    }

    if (
        readyState === VoiceReadyState.CONNECTING ||
        readyState === VoiceReadyState.CLOSED
    ) {
        return (
            <div className="h-screen-header flex items-center justify-center">
                <Loader2Icon className="size-24 animate-spin m-auto" />
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-screen-header flex flex-col-reverse">
            <div className="container py-6 flex flex-col items-center justify-end gap-4">
                <Messages user={user} />
                <Control />
            </div>
        </div>
    );
}

function Messages({ user }: IMessagesProps) {
    const { messages, fft } = useVoice();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const condensedMessages = condenseChatMessages(messages);

    return (
        <CondensedMessages
            className="max-w-5xl"
            messages={condensedMessages}
            user={user}
            maxFft={Math.max(...fft)}
        />
    );
}

function Control() {
    const { disconnect, isMuted, mute, unmute, micFft, callDurationTimestamp } =
        useVoice();

    return (
        <div className="flex gap-5 rounded border px-5 py-2 w-fit sticky bottom-6 bg-background items-center">
            <Button
                variant="ghost"
                size="icon"
                className="-mx-3"
                onClick={() => (isMuted ? unmute() : mute())}
            >
                {isMuted ? (
                    <MicOffIcon className="text-destructive" />
                ) : (
                    <MicIcon />
                )}
                <span className="sr-only">{isMuted ? "با صدا" : "بی صدا"}</span>
            </Button>
            <div className="self-stretch">
                <FftVisualizer fft={micFft} />
            </div>
            <div className="tex-sm text-muted-foreground tabular-nums">
                {callDurationTimestamp}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="-mx-3"
                onClick={() => disconnect()}
            >
                <PhoneOffIcon className="text-destructive" />
                <span className="sr-only">پایان مصاحبه</span>
            </Button>
        </div>
    );
}

function FftVisualizer({ fft }: { fft: number[] }) {
    return (
        <div className="flex gap-1 items-center h-full">
            {fft.map((value, index) => {
                const percent = (value / 4) * 100;
                return (
                    <div
                        key={index}
                        className="min-h-0.5 bg-primary/75 w-0.5 rounded"
                        style={{ height: `${percent < 10 ? 0 : percent}%` }}
                    ></div>
                );
            })}
        </div>
    );
}
