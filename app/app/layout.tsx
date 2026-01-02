// Actions
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
// Next
import { redirect } from "next/navigation";
// Component
import Navbar from "./_Navbar";
// Next
import { Metadata } from "next";

interface IAppLayout {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "پنل کاربری",
};

export default async function AppLayout({ children }: IAppLayout) {
    const { userId, user } = await getCurrentUser({ allData: true });

    if (userId == null) return redirect("/");
    if (user == null) return redirect("/onboarding");

    return (
        <>
            <Navbar imageUrl={user.imageUrl} name={user.name} />
            {children}
        </>
    );
}
