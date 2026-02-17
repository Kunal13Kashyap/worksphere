import { JWT_SECRET } from "../config/env"
import jwt from "jsonwebtoken"

export const generateToken = (userId)=>{
    return jwt.sign({
        userId
    },JWT_SECRET,{
        expiresIn: "24h"
    });
};