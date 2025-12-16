// Clerk
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Next
import { redirect } from "next/navigation";
// Component
import { OnboardingClient } from "./_client";

export default async function OnBoardingPage() {
    const { user, userId } = await getCurrentUser({ allData: true });

    if (userId === null) {
        return redirect("/");
    }

    if (user !== null) {
        return redirect("/app");
    }

    return (
        <div className="container flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl">Account</h1>
            <OnboardingClient userId={userId} />
        </div>
    );
}
