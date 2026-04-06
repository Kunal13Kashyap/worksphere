import { inviteService } from "./organization.service.js";
import AppError from "../../utils/appError.js";

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