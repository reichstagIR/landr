"use server";

import { cacheTag } from "next/cache";
// CacheTag
import { getUserIdTag } from "./dbCache";
// Drizzle
import { UserTable } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";

export async function getUser(id: string) {
    "use cache";
    cacheTag(getUserIdTag(id));
    return db.query.UserTable.findFirst({
        where: eq(UserTable.id, id),
    });
}
