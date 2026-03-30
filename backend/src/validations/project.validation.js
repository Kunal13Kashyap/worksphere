import { z } from "zod";

export const projectSchema = z.object({

    name: z.string().min(3).max(50).trim(),

    description: z.string().min(4).max(300).trim().optional(),
    
});