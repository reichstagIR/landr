import { TQuestionDifficulties } from "@/drizzle/schema";

export function formatQuestionDifficulty(difficulty: TQuestionDifficulties) {
    switch (difficulty) {
        case "easy":
            return "ساده";
        case "medium":
            return "متوسط";
        case "hard":
            return "سخت";
        default:
            throw new Error(
                `Unknown question difficulty: ${difficulty satisfies never}`
            );
    }
}
