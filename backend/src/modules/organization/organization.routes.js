import express from "express";
import { inviteController, roleUpdateController } from "./organization.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/rbac.middleware.js";
import { ROLES } from "../../utils/roles.js";

const router = express.Router();

router.post("/invite",auth,authorizeRoles(ROLES.ADMIN),inviteController);

router.patch("/users/:userId",auth,authorizeRoles(ROLES.ADMIN),roleUpdateController);

export default router;