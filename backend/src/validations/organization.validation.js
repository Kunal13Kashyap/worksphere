import { z } from "zod";
import { ROLES } from "../utils/roles.js";

export const inviteSchema = z.object({

    email: z.string().email("Invalid email format"),

    role: z.enum([ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER], {
        message: "Role must be admin, manager or member"
    })
    
});