import express from "express";
import { inviteController } from "./organization.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/rbac.middleware.js";
import { ROLES } from "../../utils/roles.js";

const router = express.Router();

router.post("/invite",auth,authorizeRoles(ROLES.ADMIN),inviteController);

export default router;