import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

export const auth = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "Access token missing"
        })
    }

    const token = authHeader.split(" ")[1];

    try{

        const decodedData = jwt.verify(token,JWT_SECRET);
        req.user = decodedData;
        next();

    }catch(error){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}