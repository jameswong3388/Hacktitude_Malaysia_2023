import Group from "../models/group.js";
import HttpStatus from "../enums/httpStatus.js";
import knex_db from "../../db/db-config.js";
import knex from "knex";

let _db;
function init(db) {
    _db = db;
}

// Implement the method body for challenge 9
async function getGroupsOfUser(userid) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                `
        SELECT groups.*
        FROM groups
        JOIN userGroups ON groups.id = userGroups.group_id
        JOIN users ON userGroups.user_id = users.id
        WHERE users.id = ?
        `,
                [userid]
            )
            .then((result) => {
                const groups = result;
                resolve(groups);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function getProjectsOfGroup(groupId) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                `SELECT pt.*, ut.image_url 
      FROM projects pt JOIN users ut on ut.id = pt.ownerId
      WHERE groupId = ?`,
                [groupId]
            )
            .then((result) => {
                const projects = result;
                resolve(projects);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function getTasksOfUser(userId, groupId) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                ` SELECT tt.*, pt.name AS projectName, pt.projectStatus
         FROM tasks tt LEFT JOIN projects pt ON tt.projectId = pt.id WHERE tt.assigneeId = ? AND pt.groupId = ?`,
                [userId, groupId]
            )
            .then((result) => {
                const tasks = result;
                resolve(tasks);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function getTasksOfProject(projectId) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(` SELECT tt.* FROM tasks tt WHERE tt.projectId = ?`, [
                projectId,
            ])
            .then((result) => {
                const tasks = result;
                resolve(tasks);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function getUsersOfGroups(groupId) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                ` SELECT 
        ut.id,
        ut.email,
        ut.firstname,
        ut.lastname,
        ut.image_url 
        FROM users ut
        LEFT JOIN userGroups ug
        ON ug.user_id=ut.id
        WHERE ug.group_id = ?`,
                [groupId]
            )
            .then((result) => {
                const users = result;
                resolve(users);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method body for challenge 11
async function addNewProject(projectDetails) {
  const { projectName, projectDescription, currentDate, endDate, userId, selectedUserGroupId, status } = projectDetails;
  
  return new Promise((resolve, reject) => {
    knex_db
      .raw(
        `
        INSERT INTO projects (name, description, createdDate, dueDate, ownerId, groupId, projectStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [projectName, projectDescription, currentDate, endDate, userId, selectedUserGroupId, status]
      )
      .then((result) => {
        resolve('success');
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Implement this method body for challenge 12
async function addNewTask(taskDetails) {}

// Implement this method for challenge 13
async function updateProject(details, projectId) {
    const { projectName, projectDescription, endDate } = details;
  
    return new Promise((resolve, reject) => {
      knex_db("projects")
        .where({ id: projectId })
        .update({
          name: projectName,
          description: projectDescription,
          dueDate: endDate,
        })
        .then(() => {
          resolve("success");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

// Implement this method for challenge 14
async function updateTask(details, taskId) {
    const { taskName, taskDescription, endDate, assignee } = details
  
    return new Promise((resolve, reject) => {
      knex_db("tasks")
        .where({ id: taskId })
        .update({
          name: taskName,
          description: taskDescription,
          dueDate: endDate,
          assigneeId: assignee
        })
        .then(() => {
          resolve("success");
        })
        .catch((error) => {
          reject(error);
        });
    });
}

// Implement this method for challenge 15
async function updateProjectStatus(projectId, status) {}

// Implement this method for challenge 16
async function updateTaskStatus(taskId, status) {}

async function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(` SELECT * FROM projects WHERE id = ?`, [projectId])
            .then((result) => {
                const project = result;
                resolve(project);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for Challenge 5
async function getGroupsFromKeyword(keyword) {
    return new Promise((resolve, reject) => {
        knex_db
            .select("*")
            .from("projects")
            .where("name", "LIKE", `%${keyword}%`)
            .then((result) => {
                const project = result;
                resolve(project);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for Challenge 5
async function addNewGroup(data) {
    return new Promise((resolve, reject) => {
        knex_db("groups")
            .insert({
                name: data.group_name,
                description: data.group_desc,
                hobbies: `[${data.group_name}]`,
                capacity: Math.floor(Math.random() * 101),
            })
            .returning("id")
            .then((result) => {
                resolve({
                    message: "New group added successfully.",
                    id: result[0],
                });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for Challenge 6
async function addUserToGroup(data) {
    return new Promise((resolve, reject) => {
        knex_db("userGroups")
            .insert({
                group_id: data.group_id,
                user_id: data.user_id,
            })
            .then((result) => {
                resolve({ message: "User add to group successfully." });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Implement this method for challenge 6
async function getGroupsFromUser(userId) {
    return new Promise((resolve, reject) => {
        knex_db("userGroups")
            .where("user_id", userId)
            .then((userGroups) => {
                // Extract groupIds from userGroups
                const groupIds = userGroups.map(
                    (userGroup) => userGroup.group_id
                );

                // Fetch groups with matching groupIds
                return knex_db("groups").whereIn("id", groupIds);
            })
            .then((groups) => {
                resolve(groups);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function parseGroupsData(data) {
    return data.map((item) => {
        return new Group(
            item.id,
            item.name,
            item.description,
            JSON.parse(item.hobbies),
            item.capacity
        );
    });
}

export default {
    init,
    getGroupsOfUser,
    getProjectsOfGroup,
    getTasksOfUser,
    getTasksOfProject,
    getUsersOfGroups,
    updateProject,
    updateTask,
    getProjectById,
    updateProjectStatus,
    updateTaskStatus,
    addNewProject,
    addNewTask,
    getGroupsFromUser,
    addUserToGroup,
    getGroupsFromKeyword,
    addNewGroup,
};
