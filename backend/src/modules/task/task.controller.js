import { taskCreateService, taskGetService, taskUpdateService, taskStatusUpdateService, taskDeleteService } from "./task.service.js";
import AppError from "../../utils/appError.js";

export const taskCreateController = async(req,res,next) => {
    try{
        const { projectId, assignedTo, title, description } = req.body;

        if (!projectId || typeof projectId !== "string") {
            throw new AppError("Project ID is required", 400);
        }

        if(!assignedTo){
            throw new AppError("Assigned user is required",400);
        }

        const task = await taskCreateService({
            projectId,
            assignedTo,
            title,
            description,
            user: req.user
        });

        res.status(201).json({
            success: true,
            message: "Task successfully created",
            data: task
        })
    } catch(error){
        next(error);
    }
};

export const taskGetController = async(req,res,next) => {
    try{
        const {projectId, status, assignedTo} = req.query;

        if (!projectId) {
            throw new AppError("Project ID is required", 400);
        }
        
        const getTasks = await taskGetService({projectId, user: req.user, status, assignedTo});

        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: getTasks
        });
    } catch(error){
        next(error);
    }
};

export const taskUpdateController = async(req,res,next) => {
    try{
        const {title, description} = req.body;
        const {taskId} = req.params;

        const isValidString = (value) => typeof value === "string" && value.trim() !== "";

        if (title === undefined && description === undefined) {
            throw new AppError("At least one field is required", 400);
        }

        if (title !== undefined && !isValidString(title)) {
            throw new AppError("Title can't be empty",400);
        }

        if (description !== undefined && !isValidString(description)) {
            throw new AppError("Description can't be empty",400);
        }

        const detailObject = {};
        if (title !== undefined) detailObject.title = title.trim();
        if (description !== undefined) detailObject.description = description.trim();

        const taskUpdate = await taskUpdateService({
            taskId,
            user: req.user,
            detailObject
        });

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: taskUpdate
        });
    } catch(error){
        next(error)
    }
};

export const taskStatusUpdateController = async(req,res,next) => {
    try{
        const { taskId } = req.params;
        const { status } = req.body;

        if (status === undefined) {
            throw new AppError("Status is required", 400);
        }

        const updatedTask = await taskStatusUpdateService({
            taskId,
            status,
            user: req.user
        });

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            data: updatedTask
        });

    } catch(error){
        next(error);
    }
};

export const taskDeleteController = async(req,res,next) => {
    try{
        const {taskId} = req.params;

        await taskDeleteService({taskId,user: req.user});

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch(error){
        next(error);
    }
};