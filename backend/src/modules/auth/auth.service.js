import userModel from "./auth.model.js";
import orgModel from "../organization/organization.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/token.js";
import inviteModel from "../organization/invite.model.js";
import AppError from "../../utils/appError.js";

export const signupService = async(email,password)=>{
    const existingUser = await userModel.findOne({ email });

    if(existingUser){
        throw new AppError("User already exists, go to Login",409);
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
        email: email,
        password: hashedPassword,
        role: "admin",
    });

    const name = newUser.email.split("@")[0];

    const newOrg = new orgModel({
        name: name,
        createdBy: newUser._id,
    });

    newUser.belongsTo = newOrg._id;

    await newOrg.save();
    await newUser.save();

    const token = generateToken(newUser);

    return token;
}

export const signupWithInvite = async(email,password,inviteId)=>{
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) throw new AppError("User already exists",409);

    const isInvited = await inviteModel.findById(inviteId);

    if(!isInvited) throw new AppError("Invalid invite",400);

    if(isInvited.status !== "pending") throw new AppError("Invite already used",400);

    if(isInvited.email !== normalizedEmail) throw new AppError("Email mismatch",400);

    const hashedPassword = await bcrypt.hash(password,10);

    const invitedUser = new userModel({
        email: normalizedEmail,
        password: hashedPassword,
        role: isInvited.role,
        belongsTo: isInvited.orgId
    });

    await invitedUser.save();

    isInvited.status = "accepted";
    await isInvited.save();

    const token = generateToken(invitedUser);

    return token;

}