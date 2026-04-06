import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import UserModel from "../modules/auth/auth.model.js";

export const auth = async(req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        throw new AppError("Access token missing",401);
    }

    if (!authHeader.startsWith("Bearer ")) {
        throw new AppError("Invalid token format", 401);
    }

    const token = authHeader.split(" ")[1];

    try{

        const decodedData = jwt.verify(token,JWT_SECRET);
        const user = await UserModel.findById(decodedData.userId);
         if (!user) {
            return next(new AppError("User not found", 404));
        }
        req.user = {
            userId: user._id,
            orgId: user.belongsTo,
            role: user.role
        };
        next();

    }catch(error){
        next(new AppError("Invalid or expired token",401));
    }
}