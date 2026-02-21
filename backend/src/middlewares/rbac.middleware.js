import createHttpError from "http-errors";

// RBAC middleware factory
export const authorizeRoles = (...allowedRoles) => {
  // 🔒 Fail fast for developer mistakes
  if (!allowedRoles || allowedRoles.length === 0) {
    throw createHttpError(
      500,
      "RBAC misconfiguration: no roles specified"
    );
  }

  return (req, res, next) => {
    // 🔐 Auth must already have run
    if (!req.user) {
      return next(
        createHttpError(403, "Access denied")
      );
    }

    const userRole = req.user.role;

    if (!userRole) {
      return next(
        createHttpError(403, "Access denied")
      );
    }

    // ✅ Core RBAC check (set membership)
    if (!allowedRoles.includes(userRole)) {
      return next(
        createHttpError(
          403,
          "You do not have permission to perform this action"
        )
      );
    }

    // 🟢 Authorized
    next();
  };
};