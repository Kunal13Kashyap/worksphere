import projectModel from "./project.model.js";
import AppError from "../../utils/appError.js";

export const projectPostService = async ({name, description, user}) => {
    const userId = user.userId;
    const orgId = user.belongsTo;

    if (!orgId) {
        throw new AppError("User is not part of any organization", 400);
    }

    try {
        const newProject = new projectModel({
            name: name.trim(),
            description: description?.trim() || "",
            orgId,
            ownerId: userId,
            createdBy: userId
        });

        await newProject.save();

        return newProject;

    } catch (error) {
        if (error.code === 11000) {
            throw new AppError("Project with this name already exists", 400);
        }
        throw error;
    }
};

export const projectGetService = async({orgId, page, limit}) => {

    if (!orgId) {
        throw new AppError("User is not part of any organization", 400);
    }

    try{
        const skip = (page-1) * limit;

        const [projects, total] = await Promise.all([
        projectModel
            .find({ orgId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

            projectModel.countDocuments({ orgId, isDeleted: false })
        ]);

        return {
            total,
            page,
            limit,
            data: projects
        };
    } catch(error){
        throw error;
    }
};

export const projectByidGetService = async({projectId, orgId}) => {
    if (!orgId) {
        throw new AppError("User is not part of any organization", 400);
    }
    if(!projectId) {
        throw new AppError("Invalid Id",400);
    }

    const getProject = await projectModel.findOne({_id: projectId, orgId, isDeleted: false});
    if(!getProject){
        throw new AppError("Not found",404);
    }
    return getProject;
};

export const projectChangeService = async({projectId, orgId, detailObject}) => {
    if (!orgId) {
        throw new AppError("User is not part of any organization", 400);
    }
    if(!projectId) {
        throw new AppError("Invalid Id",400);
    }

    if(!detailObject || Object.keys(detailObject).length === 0){
        throw new AppError("No fields to update",400);
    }

    const updateProject = await projectModel.findOneAndUpdate({_id: projectId,orgId,isDeleted: false},{$set: detailObject},{new: true, runValidators: true});
    if(!updateProject) {
        throw new AppError("Project not found",404);
    }

    return updateProject;
};

export const projectDeleteService = async({projectId,orgId}) => {
    if (!orgId) {
        throw new AppError("User is not part of any organization", 400);
    }
    if(!projectId) {
        throw new AppError("Invalid Id",400);
    }
    const deletedProject = await projectModel.findOneAndUpdate({_id: projectId, orgId, isDeleted: false},{$set: {isDeleted: true, deletedAt: new Date()}},{new: true, runValidators: true});

    if(!deletedProject) throw new AppError("Project not found",404);

    return deletedProject;
};

export const deleteOldProjectsService = async() => {

    const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await projectModel.deleteMany({
    isDeleted: true,
    deletedAt: { $exists: true, $lt: THIRTY_DAYS_AGO }
    });
};