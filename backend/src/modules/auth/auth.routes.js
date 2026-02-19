import express from "express";

import { signupWithInviteController, loginController, signupController } from "./auth.controller.js"

const router = express.Router();

router.post("/signup",signupController);

router.post("/login",loginController);

router.post("/signup-with-invite", signupWithInviteController);

export default router;