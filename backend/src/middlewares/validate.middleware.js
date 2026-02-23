import { ZodError } from "zod";
import AppError from "../utils/appError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError("Validation failed", 400)
        );
      }
      next(error);
    }
  };
};