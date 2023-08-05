import express from "express";
import groupService from "../services/groupService.js";
export const router = express.Router();
import HttpStatus from "../enums/httpStatus.js";

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const groups = await groupService.getGroupsFromUser(parseInt(userId));
    res.json(groups);
});

router.get("/:userId/userGroups", async (req, res) => {
    const userId = req.params.userId;
    const groups = await groupService.getGroupsOfUserReq(userId);
    res.json(groups);
});

router.get("/:groupId/groupProjects", async (req, res) => {
    const groupId = req.params.groupId;
    const projects = await groupService.getProjectsOfGroupReq(groupId);
    res.json(projects);
});

router.get("/:userId/:groupId/userTasks", async (req, res) => {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    const tasks = await groupService.getTasksOfUserReq(userId, groupId);
    res.json(tasks);
});

router.get("/:projectId/projectTasks", async (req, res) => {
    const projectId = req.params.projectId;
    const tasks = await groupService.getTasksOfProjectReq(projectId);
    res.json(tasks);
});

router.get("/:groupId/users", async (req, res) => {
    const groupId = req.params.groupId;
    const users = await groupService.getUsersOfGroupsReq(groupId);
    res.json(users);
});

router.put("/:projectId/updateProject", async (req, res) => {
    // Retrive and define the necessary parameters from the request body and parameter here
    const projectId = req.params.projectId;
    const details = req.body;

    const response = await groupService.updateProjectReq(details, projectId);
    res.status(response.status).json(response);
});

// Implement the route method for updateTask in challenge 14 here
router.put("/:taskId/updateTask", async (req, res) => {
    // Retrive and define the necessary parameters from the request body and parameter here
    const taskId = req.params.taskId;
    const details = req.body;

    const response = await groupService.updateTaskReq(details, taskId);
    res.status(response.status).json(response);
});

router.get("/:projectId/project", async (req, res) => {
    const projectId = req.params.projectId;
    const response = await groupService.getProjectByIdReq(projectId);
    res.json(project);
});

// Implement the route method for updateProjectStatus in challenge 15 here
router.put("/:projectId/updateProjectStatus", async (req, res) => {
    const projectId = req.params.projectId;
    const data = req.body;

    const response = await groupService.updateProjectStatus(projectId, data);
    res.status(response.status).json(response);
});

// Implement the route method for updateTaskStatus in challenge 16 here
router.put('/:taskId/updateTaskStatus', async (req, res) => {
    const taskId = req.params.taskId;
    const status = req.body.status;
    const response = await groupService.updateTaskStatusReq(taskId, status);
    res.json(response);
});


router.post("/addNewProject", async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewProjectReq(data);
    res.status(response.status).json(response);
});

router.post("/addNewTask", async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewTaskReq(data);
    res.status(response.status).json(response);
});

router.get("/keywordsearch/:keyword", async (req, res) => {
    let keyword = req.params.keyword;
    const groupSearchFilter = await groupService.getGroupsFromKeyword(keyword);
    res.send(groupSearchFilter);
});

router.post("/addNewGroup", async (req, res) => {
    const data = req.body;
    const response = await groupService.addNewGroup(data);
    res.send(response);
});

router.post("/addUserIntoGroup", async (req, res) => {
    const data = req.body;
    const response = await groupService.addUserToGroup(data);
    res.send(response);
});

export default router;
