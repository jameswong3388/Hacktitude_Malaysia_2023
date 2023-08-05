import knex from "knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secretKey = "@SecretKey#123!";
import knex_db from "../../db/db-config.js";

let _db;
function init(db) {
    _db = db;
}

// Update this method to get all users method in challenge1.a
async function getUsers() {
  try {
    const users = await knex_db('users')
      .select(
        'users.id',
        'users.email',
        'users.gender',
        'users.firstname',
        'users.lastname',
        'users.image_url',
        knex_db.raw('GROUP_CONCAT(DISTINCT hobbies.name) as hobbies'),
        knex_db.raw('GROUP_CONCAT(DISTINCT hobbies.rate) as hobby_rates'),
        knex_db.raw('GROUP_CONCAT(DISTINCT skills.name) as skills'),
        knex_db.raw('GROUP_CONCAT(DISTINCT skills.rate) as skill_rates')
      )
      .leftJoin('hobbies', 'users.id', 'hobbies.userId')
      .leftJoin('skills', 'users.id', 'skills.userId')
      .groupBy('users.id');

    // Organize the data into the desired format
    const usersWithHobbiesAndSkills = users.map((user) => {
      const hobbies = user.hobbies
        ? user.hobbies.split(',').map((hobby, index) => ({
            name: hobby,
            rate: parseInt(user.hobby_rates.split(',')[index]),
          }))
        : [];
      const skills = user.skills
        ? user.skills.split(',').map((skill, index) => ({
            name: skill,
            rate: parseInt(user.skill_rates.split(',')[index]),
          }))
        : [];

      return {
        id: user.id,
        email: user.email,
        gender: user.gender,
        firstname: user.firstname,
        lastname: user.lastname,
        image_url: user.image_url,
        hobbies,
        skills,
      };
    });

    return usersWithHobbiesAndSkills;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Update this method to complete challenge0.c and challenge1.b
async function getUser(id) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                `
        SELECT
          ut.id,
          ut.email,
          ut.gender,
          ut.firstname,
          ut.lastname,
          ut.image_url,
          uht.name AS hobbyName,
          uht.rate AS hobbyRate,
          ust.name AS skillName,
          ust.rate AS skillRate
        FROM users ut
        LEFT JOIN hobbies uht ON ut.id = uht.userId
        LEFT JOIN skills ust ON ut.id = ust.userId
        WHERE ut.id = ?
        `,
                [id]
            )
            .then((result) => {
                const rows = result;
                let hobbyExist, skillExist;

                if (rows.length === 0) {
                    resolve("User not found!");
                    return;
                }

                const user = {
                    id: rows[0].id,
                    email: rows[0].email,
                    gender: rows[0].gender,
                    firstname: rows[0].firstname,
                    lastname: rows[0].lastname,
                    image_url: rows[0].image_url,
                    hobbies: [],
                    skills: [],
                };

                rows.forEach((row) => {
                    hobbyExist = false;
                    if (row.hobbyName && row.hobbyRate) {
                        user.hobbies.map((hobby) => {
                            if (hobby.name === row.hobbyName) {
                                hobbyExist = true;
                            }
                        });
                        if (!hobbyExist) {
                            user.hobbies.push({
                                name: row.hobbyName,
                                rate: row.hobbyRate,
                            });
                        }
                    }

                    hobbyExist = false;
                    if (row.skillName && row.skillRate) {
                        user.skills.map((skill) => {
                            if (skill.name === row.skillName) {
                                skillExist = true;
                            }
                        });
                        if (!skillExist) {
                            user.skills.push({
                                name: row.skillName,
                                rate: row.skillRate,
                            });
                        }
                    }
                });

                resolve(user);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

//delete a user
async function deleteUser(id) {
    await knex_db.raw("PRAGMA foreign_keys = ON");

    return new Promise((resolve, reject) => {
        knex_db
            .raw("SELECT * FROM users WHERE id = ?", [id])
            .then((userFound) => {
                if (!userFound[0]) {
                    resolve("User not found!");
                    return;
                }

                knex_db
                    .raw("DELETE FROM users WHERE id = ?", [id])
                    .then(() => {
                        resolve("User deleted successfully!");
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(error);
                    });
            });
    });
}

export default {
    getUsers,
    init,
    getUser,
    deleteUser,
};
