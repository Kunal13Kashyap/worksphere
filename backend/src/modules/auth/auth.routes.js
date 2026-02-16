import express from "express";
import * as jwt from "jsonwebtoken";
import userModel from "./auth.model.js";
import { JWT_SECRET } from "../../config/env.js";

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

        const newUser = new userModel({
            email,
            password
        });

        await newUser.save();

        const token = jwt.sign({
            userId: newUser._id
        }, JWT_SECRET);

        res.status(201).json({
            message: "User created successfully",
            token
        });

    }catch(error){
        res.status(500).json({
            message: "Error while signing Up"
        });
    };
});

router.post("/login",async (req,res)=>{
    const { email, password } = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(403).json({
            message: "User doesn't exist, go to Sign Up"
        });
    }
    
    if(user.password !== password){
        return res.status(403).json({
            message: "Invalid Credentials"
        });
    }
    
});

export default router;