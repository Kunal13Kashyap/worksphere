import AppError from "../../utils/appError.js";
import TaskModel from "../task/task.model.js";
import ProjectModel from "../project/project.model.js";
import UserModel from "../auth/auth.model.js";
import { TASK_STATUS } from "../../utils/constants.js";

export const taskCreateService = async({projectId,assignedTo,title,description,user}) => {
    const userId = user.userId;
    const orgId = user.orgId;

    if(!orgId){
        throw new AppError("User is not the part of any organization",400);
    }

    const project = await ProjectModel.findOne({ _id: projectId, orgId }).lean();
    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const assignee = await UserModel.findOne({ _id: assignedTo, belongsTo: orgId }).lean();
    if (!assignee) {
        throw new AppError("Assigned user not in org", 400);
    }

    const newTask = await TaskModel.create({
        title: title.trim(),
        description: description?.trim(),
        assignedTo,
        projectId,
        orgId,
        createdBy: userId
    });

    return newTask;
};

export const taskGetService = async ({ projectId, user, status, assignedTo }) => {
    const orgId = user.orgId;

    if (!orgId) {
        throw new AppError("User is not part of any organization", 400);
    }

    const project = await ProjectModel.findOne({ _id: projectId, orgId}).lean();
    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const query = {
        projectId,
        orgId,
        isArchived: false
    };

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await TaskModel.find(query).lean();

    return tasks;
};

export const taskUpdateService = async ({ taskId, user, detailObject }) => {
    const orgId = user.orgId;

    if (!orgId) {
        throw new AppError("User not part of any organization", 400);
    }

    if(!detailObject || Object.keys(detailObject).length === 0){
        throw new AppError("No fields to update",400);
    }
    
    const task = await TaskModel.findOneAndUpdate({_id: taskId, orgId, isArchived: false},{$set: detailObject},{new: true, runValidators: true});
    if(!task) throw new AppError("Task not found",404);
    return task;
    
};

export const taskStatusUpdateService = async ({ taskId, status, user }) => {

    if (!TASK_STATUS.includes(status)) {
        throw new AppError("Invalid status value", 400);
    }

    const orgId = user.orgId;

    if (!orgId) {
        throw new AppError("User not part of any organization", 400);
    }

    const task = await TaskModel.findOne({ _id: taskId, orgId, isArchived: false });

    if (!task) throw new AppError("Task not found", 404);

    const isOwner = task.assignedTo?.toString() === user.userId?.toString();
    const isMember = user.role === "member";

    if (isMember && !isOwner) {
        throw new AppError("Not allowed to update status", 403);
    }
    
    task.status = status;
    await task.save();

    return task;
};

export const taskDeleteService = async ({ taskId, user}) => {

    const orgId = user.orgId;

    if (!orgId) {
        throw new AppError("User not part of any organization", 400);
    }

    const deleteTask = await TaskModel.findOneAndUpdate({_id: taskId, orgId, isArchived: false},{$set: {isArchived: true}},{new: true});

    if (!deleteTask) {
        throw new AppError("Task not found", 404);
    }

    return deleteTask;
};