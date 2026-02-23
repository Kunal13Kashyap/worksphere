import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const auth = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        throw new AppError("Access token missing",401);
    }

    const token = authHeader.split(" ")[1];

    try{

        const decodedData = jwt.verify(token,JWT_SECRET);
        req.user = decodedData;
        next();

    }catch(error){
        next(new AppError("Invalid or expired token",401));
    }
}