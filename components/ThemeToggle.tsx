"use client";

// Theme
import { useTheme } from "next-themes";
// Icon
import { Monitor, Moon, Sun } from "lucide-react";
// ShadCn
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// React
import { useEffect, useState } from "react";
// Utils
import { cn } from "@/lib/utils";

const themes = [
    {
        name: "Light",
        Icon: Sun,
        value: "light",
    },
    {
        name: "Dark",
        Icon: Moon,
        value: "dark",
    },
    {
        name: "System",
        Icon: Monitor,
        value: "system",
    },
] as const;

export function ThemeToggle() {
    const [mounted, setMounted] = useState<boolean>(false);
    const { setTheme, theme, resolvedTheme } = useTheme();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    {resolvedTheme === "dark" ? <Moon /> : <Sun />}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map(({ name, Icon, value }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() => setTheme(value)}
                        className={cn(
                            "cursor-pointer",
                            theme === value &&
                                "bg-accent text-accent-foreground"
                        )}
                    >
                        <Icon className="size-4" />
                        {name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
