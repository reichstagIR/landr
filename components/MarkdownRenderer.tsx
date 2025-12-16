// Lib
import { cn } from "@/lib/utils";
// React
import { ComponentProps } from "react";
// MarkDown
import Markdown from "react-markdown";

export function MarkdownRenderer({
    className,
    ...props
}: { className?: string } & ComponentProps<typeof Markdown>) {
    return (
        <div
            className={cn(
                "max-w-none prose prose-neutral dark:prose-invert font-sans",
                className
            )}
        >
            <Markdown {...props} />
        </div>
    );
}
