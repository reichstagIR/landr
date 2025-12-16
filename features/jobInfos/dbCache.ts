// Catch
import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
// Next
import { revalidateTag } from "next/cache";

export function getJobInfoGlobalTag() {
    return getGlobalTag("jobInfos");
}

export function getJobInfoUserTag(userId: string) {
    return getUserTag("jobInfos", userId);
}

export function getJobInfoIdTag(id: string) {
    return getIdTag("jobInfos", id);
}

export function revalidateJobInfo({
    id,
    userId,
}: {
    id: string;
    userId: string;
}) {
    revalidateTag(getJobInfoGlobalTag(), "max");
    revalidateTag(getJobInfoUserTag(userId), "max");
    revalidateTag(getJobInfoIdTag(id), "max");
}
