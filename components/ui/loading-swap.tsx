// Lib
import { cn } from "@/lib/utils";
// Icon
import { Loader2Icon } from "lucide-react";
// React
import type { ReactNode } from "react";

type LoadingSwapProps = {
    isLoading: boolean;
    children: ReactNode;
    className?: string;
    loadingIconClassName?: string;
};

export function LoadingSwap({
    isLoading,
    children,
    className,
    loadingIconClassName,
}: LoadingSwapProps) {
    return (
        <div className="grid grid-cols-1 items-center justify-items-center">
            <div
                className={cn(
                    "col-start-1 col-end-2 row-start-1 row-end-2 w-full",
                    isLoading ? "invisible" : "visible",
                    className
                )}
            >
                {children}
            </div>
            <div
                className={cn(
                    "col-start-1 col-end-2 row-start-1 row-end-2",
                    isLoading ? "visible" : "invisible",
                    className
                )}
            >
                <Loader2Icon
                    className={cn("animate-spin", loadingIconClassName)}
                />
            </div>
        </div>
    );
}
