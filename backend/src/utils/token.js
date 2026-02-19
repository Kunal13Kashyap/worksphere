import { JWT_SECRET } from "../config/env.js"
import jwt from "jsonwebtoken"

export const generateToken = (user)=>{
    return jwt.sign({
        userId: user._id,
        role: user.role,
        belongsTo: user.belongsTo
    },JWT_SECRET,{
        expiresIn: "24h"
    });
};