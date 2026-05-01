import { inviteService, roleUpdateService } from "./organization.service.js";
import AppError from "../../utils/appError.js";
import UserModel from "../auth/auth.model.js";
import { ROLES } from "../../utils/roles.js";
import mongoose from "mongoose";

export const inviteController = async(req,res,next)=>{

    try{

        if(req.user.role !== "admin"){
            throw new AppError("Unauthorized",403);
        };

        const userEmail = req.body.email;
        const orgId = req.user.orgId;
    
        const inviteId = await inviteService(userEmail,orgId);
        return res.status(200).json({
            message: "Invited Successfully",
            inviteId: inviteId
        });

    }
    catch(error){
        next(error);
    };
    
}

export const roleUpdateController = async(req,res,next)=>{

    try{
        const { userId } = req.params;
        const adminOrgId = req.orgId;
        
        if(!mongoose.Types.ObjectId.isValid(userId)) throw new AppError("Invalid UserId",400);

        const { role = "member" } = req.body;

        if (!Object.values(ROLES).includes(role)) throw new AppError("Invalid role",400);

        const updateUserRole = await roleUpdateService({targetUserId: userId, adminOrgId, userUpdatedRole: role});

        return res.status(200).json({
            message: "User's role has been updated",
            userId: updateUserRole._id,
            role: updateUserRole.role
        })

    } catch(error){
        next(error)
    }

}