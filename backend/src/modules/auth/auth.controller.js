import { signupWithInvite, signupService } from "./auth.service.js";
import userModel from "./auth.model.js";
import TokenModel from "./token.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/token.js";
import AppError from "../../utils/appError.js";
import { JWT_SECRET } from "../../config/env.js";
import jwt from "jsonwebtoken";
import { logAudit } from "../audit/audit.logger.js";

export const signupWithInviteController = async(req,res,next)=>{
    const { email, password, inviteId } = req.body;
    try{
        const token = await signupWithInvite(email,password,inviteId);
        return res.status(200).json({
            success: true,
            message: "Signed Up successfully",
            token: token
        });
    }catch(error){
        next(error);
    }
}

export const signupController = async (req,res,next)=>{
    const { email, password } = req.body;
    try{ 
        const token = await signupService(email, password);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token: token
        });
    }
    catch(error){
        next(error);
    };
}

export const loginController = async (req,res,next)=>{
    const { email, password } = req.body;

    try{

        const user = await userModel.findOne({email});

        if(!user){
            throw new AppError("User doesn't exist, go to Sign Up",401);
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
            if(!isPasswordValid){
                await logAudit({
                action: "LOGIN",
                actor: user._id,
                metadata: {
                    email
                },
                status: "failed",
                ip: req.ip
            })
            throw new AppError("Invalid Credentials",401);
        }

        const token = generateToken(user);

        await logAudit({
            action: "LOGIN",
            actor: user._id,
            metadata: {
                email: user.email
            },
            status: "success",
            ip: req.ip
        })

        return res.status(200).json({
            success: true,
            message: "Token generated successfully",
            token: token
        });

    }catch(err){
        next(err);
    }
}

export const logoutController = async (req,res,next)=>{
    const decodedToken = req.decoded;
    await TokenModel.updateOne(
        { token: req.token },
        { $setOnInsert: { token: req.token, expiresAt: new Date(req.decoded.exp * 1000) } },
        { upsert: true }
    );

    await logAudit({
        action: "LOGOUT",
        actor: req.user.userId,
        metadata: {
            blacklistToken: req.token
        },
        status: "success",
        ip: req.ip 
    })
    
    return res.status(200).json({
        message: "Logged out successfully"
    })
}