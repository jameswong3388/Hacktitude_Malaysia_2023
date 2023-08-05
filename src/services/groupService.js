import groupRepository from "../repositories/groupRepository.js";
import httpStatus from "../enums/httpStatus.js";
import dbConnection from "../../sqlite.js";

//initialize db connection
function initializeApp() {
    dbConnection
        .getDbConnection()
        .then((db) => {
            groupRepository.init(db);
        })
        .catch((err) => {
            console.error("Error initializing the application:", err);
            process.exit(1); // Exit the application or handle the error appropriately
        });
}

async function getGroupsOfUserReq(id) {
    const response = await groupRepository.getGroupsOfUser(id);
    return { response: response, status: httpStatus.OK };
}

async function getProjectsOfGroupReq(id) {
    const response = await groupRepository.getProjectsOfGroup(id);
    return { response: response, status: httpStatus.OK };
}

async function getTasksOfUserReq(id, groupId) {
    const response = await groupRepository.getTasksOfUser(id, groupId);
    return { response: response, status: httpStatus.OK };
}

async function getTasksOfProjectReq(projectId) {
    const response = await groupRepository.getTasksOfProject(projectId);
    return { response: response, status: httpStatus.OK };
}

async function getUsersOfGroupsReq(groupId) {
    const response = await groupRepository.getUsersOfGroups(groupId);
    return { response: response, status: httpStatus.OK };
}

// Implement the method updateProjectReq(details, projectId) for challenge 13 here
async function updateProjectReq(details, projectId) {
    const response = await groupRepository.updateProject(details, projectId);
    return { response: response, status: httpStatus.OK };
}

// Implement the method updateTaskReq(details, taskId) for challenge 14 here
async function updateTaskReq(details, taskId) {
    const response = await groupRepository.updateTask(details, taskId);
    return { response: response, status: httpStatus.OK };
}

async function getProjectByIdReq(projectId) {
    const response = await groupRepository.getProjectById(projectId);
    return { response: response, status: httpStatus.OK };
}

// Implement the method updateProjectStatusReq(projectId, status) for challenge 15 here
async function updateProjectStatus(projectId, data) {
    const response = await groupRepository.updateProjectStatus(projectId, data);
    return { response: response, status: httpStatus.OK };
}

// Implement the method updateTaskStatusReq(taskId, status) for challenge 16 here
async function updateTaskStatusReq(taskId, status) {
    const details = status;
    const response = groupRepository.updateTaskStatus(details, taskId);
    return { response: response, status: httpStatus.OK };
}

async function addNewProjectReq(projectDetails) {
    const response = await groupRepository.addNewProject(projectDetails);
    return { response: response, status: httpStatus.OK };
}

async function addNewTaskReq(taskDetails) {
    const response = await groupRepository.addNewTask(taskDetails);
    return { response: response, status: httpStatus.OK };
}
// Implement this method for Challenge 5
async function getGroupsFromKeyword(keyword) {
    const response = await groupRepository.getGroupsFromKeyword(keyword);

    if (response) {
        return { response: response, statusbar: httpStatus.OK };
    } else {
        return { response: [], statusbar: httpStatus.OK };
    }
}

// Implement this method for Challenge 5
async function addNewGroup(data) {
    const response = await groupRepository.addNewGroup(data);
    return { response: response, status: httpStatus.OK };
}

// Implement this method for Challenge 6
async function addUserToGroup(data) {
    const response = await groupRepository.addUserToGroup(data);
    return { response: response, status: httpStatus.OK };
}

// Implement this method for Challenge 6
async function getGroupsFromUser(user_id) {
    const response = await groupRepository.getGroupsFromUser(user_id);
    return { response: response, status: httpStatus.OK };
}

initializeApp();

export default {
    initializeApp,
    getGroupsOfUserReq,
    getProjectsOfGroupReq,
    getTasksOfUserReq,
    getTasksOfProjectReq,
    getUsersOfGroupsReq,
    getProjectByIdReq,
    getGroupsFromKeyword,
    getGroupsFromUser,
    addNewProjectReq,
    addNewTaskReq,
    addNewGroup,
    addUserToGroup,
    updateProjectReq,
    updateProjectStatus,
    updateTaskReq,
    updateTaskStatusReq,
};
