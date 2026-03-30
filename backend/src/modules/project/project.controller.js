import { projectPostService, projectGetService, projectByidGetService, projectChangeService, projectDeleteService } from "./project.service.js";
import mongoose from "mongoose";
import AppError from "../../utils/appError.js";

export const projectPostController = async(req,res,next) => {

    try{
        const { name, description } = req.body;
        const createdProject = await projectPostService({name,description, user: req.user});

        res.status(201).json({
            message: "Project created successfully",
            data: createdProject
        });

    }
    catch(error){
        next(error);
    };

};

export const projectGetController = async(req,res,next) => {

    try{
        const orgId = req.user.belongsTo;

        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        limit = Math.min(limit, 50);

        const projects = await projectGetService({orgId, page, limit});

        res.status(200).json({
            message: "Projects fetched successfully",
            ...projects
        });

    }catch(error){
        next(error);
    }
};

export const projectByidGetController = async(req,res,next) => {
    try{
        const projectId = req.params.projectId;
        const orgId = req.user.belongsTo;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new AppError("Invalid project ID", 400);
        }
        const projectWanted = await projectByidGetService({projectId, orgId});

        res.status(200).json({
            message: 'Project fetched successfully',
            project: projectWanted
        })

    } catch(error){
        next(error);
    }
};

export const projectChangeController = async(req, res, next) => {
    try {
        const { name, description } = req.body;
        const projectId = req.params.projectId;
        const orgId = req.user.belongsTo;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new AppError("Invalid project ID", 400);
        }

        const isValidString = (value) =>
        typeof value === "string" && value.trim() !== "";

        if (!isValidString(name) && !isValidString(description)) {
            throw new AppError("At least one valid field is required",400);
        }

        if (name !== undefined && !isValidString(name)) {
            throw new AppError("Name can't be empty",400);
        }

        if (description !== undefined && !isValidString(description)) {
            throw new AppError("Description can't be empty",400);
        }

        const detailObject = {};
        if (name !== undefined) detailObject.name = name.trim();
        if (description !== undefined) detailObject.description = description.trim();

        const updateProject = await projectChangeService({
            projectId,
            orgId,
            detailObject
        });

        return res.status(200).json({
            message: `Project: ${projectId} updated successfully`,
            project: updateProject
        });

    } catch (error) {
        next(error);
    }
};

export const projectDeleteController = async(req,res,next) => {
    try{
        const projectId = req.params.projectId;
        const orgId = req.user.belongsTo;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            throw new AppError("Invalid project ID", 400);
        }

        const deleteProject = await projectDeleteService({projectId,orgId});

        res.status(200).json({
            message: `Project: ${projectId} deleted successfully`,
            project: deleteProject
        })
    } catch(error){
        next(error);
    }
};