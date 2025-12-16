// Drizzle
import { experienceLevel } from "@/drizzle/schema";
// Zod
import z from "zod";

export const jobInfoSchema = z.object({
    name: z.string().min(1, { error: "این فیلد ضروری است!" }),
    title: z.string().min(1).nullable(),
    experienceLevel: z.enum(experienceLevel),
    description: z.string().min(1, { error: "این فیلد ضروری است!" }),
});
