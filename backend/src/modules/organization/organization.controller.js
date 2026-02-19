import { inviteService } from "./organization.service.js";

export const inviteController = async(req,res)=>{

    if(req.user.role !== "admin"){
        return res.status(403).json({
            message: "Unauthorized"
        });
    };

    const userEmail = req.body.email;
    const orgId = req.user.belongsTo;

    try{
        const inviteId = await inviteService(userEmail,orgId);
        return res.status(200).json({
            message: "Invited Successfully",
            inviteId: inviteId
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Failed to send invite",
            error: error.message
        });
    };
    
}