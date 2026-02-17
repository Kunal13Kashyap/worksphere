import express from "express";
import jwt from "jsonwebtoken";
import userModel from "./auth.model.js";
import { JWT_SECRET } from "../../config/env.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/token.js";

const router = express.Router();

router.post("/signup",async (req,res)=>{
    const { email, password } = req.body;

    try{
        const existingUser = await userModel.findOne({ email });

        if(existingUser){
            return res.status(403).json({
                message: "User already exists, go to Login"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        res.status(201).json({
            message: "User created successfully",
            token
        });

    }catch(error){
        return res.status(500).json({
            message: "Error while signing Up",
        });
    };
});

router.post("/login",async (req,res)=>{
    const { email, password } = req.body;

    try{

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(401).json({
                message: "User doesn't exist, go to Sign Up"
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user._id);
        return res.status(200).json({
            message: "Token generated successfully",
            token: token
        });

    }catch(err){
        return res.status(500).json({
            message: "Error while signing In"
        })
    }
});

export default router;