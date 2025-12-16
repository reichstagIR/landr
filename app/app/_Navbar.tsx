"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/drizzle/schema";
// Clerk
import { useClerk, SignOutButton } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
// Icons
import {
    BrainCircuitIcon,
    User,
    LogOut,
    BookOpenIcon,
    FileSlidersIcon,
    SpeechIcon,
} from "lucide-react";
// Next
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
// Component
import { UserAvatar } from "@/features/users/components/UserAvatar";

interface INavbar {
    imageUrl: (typeof UserTable.$inferInsert)["imageUrl"];
    name: (typeof UserTable.$inferInsert)["name"];
}

const navLinks = [
    { name: "مصاحبه ها", href: "interviews", Icon: SpeechIcon },
    { name: "سوالات", href: "questions", Icon: BookOpenIcon },
    { name: "روزمه", href: "resume", Icon: FileSlidersIcon },
] as const;

export default function Navbar({ imageUrl, name }: INavbar) {
    const { openUserProfile } = useClerk();
    const { jobInfoId } = useParams();
    const pathName = usePathname();

    return (
        <nav className="h-header border-b">
            <div className="container flex h-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/app">
                        <BrainCircuitIcon className="size-8 text-primary" />
                    </Link>
                    <span className="text-xl font-bold">Landr</span>
                </div>

                <div className="flex items-center gap-4">
                    {typeof jobInfoId === "string" &&
                        navLinks.map(({ name, href, Icon }) => {
                            const hrefPath = `/app/job-infos/${jobInfoId}/${href}`;

                            return (
                                <Button
                                    variant={
                                        pathName === hrefPath
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    key={name}
                                    asChild
                                    className="cursor-pointer max-sm:hidden"
                                >
                                    <Link href={hrefPath}>
                                        <Icon />
                                        {name}
                                    </Link>
                                </Button>
                            );
                        })}

                    <ThemeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <UserAvatar imageUrl={imageUrl} name={name} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => openUserProfile()}>
                                <User className="mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <SignOutButton>
                                <DropdownMenuItem>
                                    <LogOut className="mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </SignOutButton>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
