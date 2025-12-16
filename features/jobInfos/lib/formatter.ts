// Drizzle
import { TExperienceLevel } from "@/drizzle/schema";

export function formatExperienceLevel(level: TExperienceLevel) {
    switch (level) {
        case "junior":
            return "جونیور";
        case "mid-lever":
            return "میدلول";
        case "senior":
            return "سینیور";
        default:
            throw new Error(
                `Invalid experience level: ${level satisfies never}`
            );
    }
}
