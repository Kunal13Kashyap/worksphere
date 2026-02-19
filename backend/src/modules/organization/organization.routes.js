import express from "express";
import { inviteController } from "./organization.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/invite",auth,inviteController);

export default router;