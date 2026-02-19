import { signupWithInvite } from "./auth.service.js";
import { signupService } from "./auth.service.js";
import userModel from "./auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/token.js";

export const signupWithInviteController = async(req,res)=>{
    const { email, password, inviteId } = req.body;
    try{
        const token = await signupWithInvite(email,password,inviteId);
        return res.status(200).json({
            message: "Signed Up successfully",
            token: token
        });
    }catch(error){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const signupController = async (req,res)=>{
    const { email, password } = req.body;
    try{ 
        const token = await signupService(email, password);
        res.status(201).json({
        message: "User created successfully",
        token: token
        });
    }
    catch(error){
        return res.status(500).json({
            message: "Error while signing Up",
        });
    };
}

export const loginController = async (req,res)=>{
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

        const token = generateToken(user);
        return res.status(200).json({
            message: "Token generated successfully",
            token: token
        });

    }catch(err){
        return res.status(500).json({
            message: "Error while signing In"
        })
    }
}