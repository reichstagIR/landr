// Clerk
import { hasPermission } from "@/services/clerk/lib/hasPermissions";

export async function canRunResumeAnalysis() {
    return hasPermission("unlimited_resume_analysis");
}