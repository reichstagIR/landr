// Drizzle
import { uuid, timestamp } from "drizzle-orm/pg-core";

export const id = uuid().primaryKey().defaultRandom();
export const createAt = timestamp({ withTimezone: true })
    .notNull()
    .defaultNow();
export const updateAt = timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
