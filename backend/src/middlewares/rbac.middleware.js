import AppError from "../utils/appError.js";

// RBAC middleware factory
export const authorizeRoles = (...allowedRoles) => {
  // 🔒 Fail fast for developer mistakes
  if (!allowedRoles || allowedRoles.length === 0) {
    throw new AppError("RBAC misconfiguration: no roles specified",500);
  }

  return (req, res, next) => {
    // 🔐 Auth must already have run
    if (!req.user) {
      throw new AppError("Access denied",403);
    }

    const userRole = req.user.role;

    if (!userRole) {
      throw new AppError("Access denied",403);
    }

    // ✅ Core RBAC check (set membership)
    if (!allowedRoles.includes(userRole)) {
      throw new AppError("You do not have permission to perform this action",403);
    }

    // 🟢 Authorized
    next();
  };
};