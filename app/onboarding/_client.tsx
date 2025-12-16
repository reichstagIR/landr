"use client";

// Actions
import { getUser } from "@/features/users/actions";
// Icon
import { Loader2Icon } from "lucide-react";
// Next
import { useRouter } from "next/navigation";
// React
import { useEffect } from "react";

interface IOnboardingClient {
    userId: string;
}

export function OnboardingClient({ userId }: IOnboardingClient) {
    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const user = await getUser(userId);

            if (user === null) return;

            router.replace("/app");

            clearInterval(intervalId);
        }, 250);

        return () => {
            clearInterval(intervalId);
        };
    }, [userId]);

    return <Loader2Icon className="animate-spin size-24" />;
}
