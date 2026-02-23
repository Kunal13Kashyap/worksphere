import UserModel from "../auth/auth.model.js";
import InviteModel from "./invite.model.js";
import AppError from "../../utils/appError.js";

export const inviteService = async(userEmail,orgId)=>{
    const normalizedEmail = userEmail.trim().toLowerCase();

    const findUser = await UserModel.findOne({
        email: normalizedEmail,
        belongsTo: orgId
    });

    if(findUser){
        throw new AppError("User already exists",409);
    }

    const invitePending = await InviteModel.findOne({
        email: normalizedEmail,
        orgId: orgId,
        status: "pending"
    });

    if(invitePending){
        throw new AppError("Invitation of this user is in pending state",409);
    }

    const newInvite = new InviteModel({
        email: normalizedEmail,
        orgId: orgId,
    });

    await newInvite.save();

    return newInvite._id;

};