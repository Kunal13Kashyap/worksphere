import { z } from "zod";

export const signupSchema = z.object({

    name: z.string().min(2, "Name must have atleast 2 characters").max(50, "Name can't have more than 50 characters"),

    email: z.string().email("Invalid email format").max(50, "Email must not exceed 50 characters"),

    password: z.string().min(10, "Password must be atleast 10 characters").max(50, "Password can't exceed 50 characters")

});

export const loginSchema = z.object({

    email: z.string().email("Invalid email format").max(50, "Email must not exceed 50 characters"),

    password: z.string().min(1, "Password is required"),

});

export const signupWithInviteSchema = z.object({

    name: z.string().min(2, "Name must have atleast 2 characters").max(50, "Name can't have more than 50 characters"),

    email: z.string().email("Invalid email format").max(50, "Email must not exceed 50 characters"),

    password: z.string().min(10, "Password must be atleast 10 characters").max(50, "Password can't exceed 50 characters")

});