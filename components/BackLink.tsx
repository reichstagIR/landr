// Utils
import { cn } from "@/lib/utils";
// ShadCn
import { Button } from "./ui/button";
// Next
import Link from "next/link";
import { Route } from "next";
// Icon
import { ArrowRightIcon } from "lucide-react";

interface IBackLink {
    href: Route;
    children: React.ReactNode;
    className?: string;
}

export function BackLink({ children, className = "", href }: IBackLink) {
    return (
        <Button asChild variant="ghost" className={cn("-ml-3", className)}>
            <Link
                href={href}
                className="flex gap-2 items-center text-sm text-muted-foreground"
            >
                <ArrowRightIcon />
                {children}
            </Link>
        </Button>
    );
}
