import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { signupWithInviteController, loginController, signupController } from "./auth.controller.js";
import { signupSchema, loginSchema, signupWithInviteSchema } from "../../validations/index.js";

const router = express.Router();

router.post("/signup",validate(signupSchema),signupController);

router.post("/login",validate(loginSchema),loginController);

router.post("/signup-with-invite",validate(signupWithInviteSchema),signupWithInviteController);

export default router;