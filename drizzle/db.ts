// Drizzle
import { drizzle } from "drizzle-orm/node-postgres";
// Env
import { env } from "@/data/env/server";
// Schema
import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema });
