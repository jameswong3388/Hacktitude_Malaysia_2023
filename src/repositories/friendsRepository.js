import knex from "knex";
import knex_db from "../../db/db-config.js";
import userRepository from "./userRepository.js";
import httpStatus from "../enums/httpStatus.js";

let _db;
function init(db) {
    _db = db;
}

//Update this method to complete challenge2.a
async function getSuggestedFriends(userId) {
    // Get the user's hobbies
    const userHobbies = await knex_db("hobbies").where("userId", userId);

    // Get all users
    const users = await knex_db("users").whereNot("id", userId);

    const suggestions = [];

    for (const user of users) {
        // Get each user's hobbies
        const hobbies = await knex_db("hobbies").where("userId", user.id);
        const skills = await knex_db("skills").where("userId", user.id);

        let totalRateDifference = 0;
        let sharedHobbies = 0;

        for (const hobby of hobbies) {
            // Find matching hobbies
            const matchingHobby = userHobbies.find(
                (uh) => uh.name === hobby.name
            );

            // If a matching hobby is found, calculate the rate difference
            if (matchingHobby) {
                totalRateDifference += Math.abs(
                    matchingHobby.rate - hobby.rate
                );
                sharedHobbies++;
            }
        }

        // If the user shares at least one hobby with the current user
        if (sharedHobbies > 0 && totalRateDifference > 0) {
            // Check if the user is already a friend
            const isFriend = await knex_db("friends")
                .where(function () {
                    this.where("sender_id", userId)
                        .andWhere("recipient_id", user.id)
                        .orWhere("sender_id", user.id)
                        .andWhere("recipient_id", userId);
                })
                .first();

            // If the user is not a friend, add them to the suggestions list
            if (!isFriend) {
                suggestions.push({
                    ...user,
                    hobbies,
                    skills,
                });
            }
        }
    }

    // Sort the suggestions by rate difference (ascending) and take the first 5
    return suggestions
        .sort((a, b) => a.rateDifference - b.rateDifference)
        .slice(0, 5);
}

//Update this method to complete challenge3.a, challenge3.b and challenge3.c
async function sendReq(data) {
    const { sender_id, recipient_id, status } = data;
    return new Promise((resolve, reject) => {
        knex_db
            .raw(
                "SELECT * FROM friends WHERE sender_id = ? AND recipient_id = ?",
                [sender_id, recipient_id]
            )
            .then((exists) => {
                if (exists.length > 0) {
                    resolve(httpStatus.BAD_REQUEST);
                    return;
                } else {
                    knex_db
                        .raw(
                            "SELECT * FROM friends WHERE recipient_id = ? AND sender_id = ?",
                            [sender_id, recipient_id]
                        )
                        .then((sent) => {
                            if (sent.length > 0) {
                                resolve(httpStatus.FORBIDDEN);
                                return;
                            } else {
                                knex_db
                                    .raw(
                                        "INSERT INTO friends (sender_id, recipient_id, status) VALUES (?, ?, ?)",
                                        [sender_id, recipient_id, status]
                                    )
                                    .then(() => {
                                        resolve("success");
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            }
                        });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//Update this method to view the users to whom the requests were sent and complete challenge3.d
async function viewSentReqs(id) {
    try {
        let reqSentUsers = [];

        const reqsSent = await knex_db("friends")
            .select("id", "status", "sender_id", "recipient_id")
            .where("sender_id", id)
            .andWhere("status", "PENDING");

        for (const req of reqsSent) {
            const userSender = await userRepository.getUser(req.recipient_id);
            userSender.reqId = req.id;
            reqSentUsers.push(userSender);
        }

        return reqSentUsers;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Update this method to view the users whose the requests were received and complete challenge3.e
async function viewPendingReqs(id) {
    try {
        let reqReceivedUsers = [];
        const reqsReceived = await knex_db("friends")
            .select("id", "status", "sender_id", "recipient_id")
            .where("recipient_id", id)
            .andWhere("status", "PENDING");

        for (const req of reqsReceived) {
            const reqReceiving = await userRepository.getUser(req.sender_id);
            reqReceiving.reqId = req.id;
            reqReceivedUsers.push(reqReceiving);
        }
        return reqReceivedUsers;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//Update this method to complete the challenge3.f
async function acceptReq(id) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw("UPDATE friends SET status = 'ACCEPTED' WHERE id = ?", [id])
            .then(() => {
                resolve("success");
                console.log(id);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//Update this method to complete the challenge3.g
async function rejectReq(id) {
    return new Promise((resolve, reject) => {
        knex_db
            .raw("SELECT * FROM friends WHERE id = ?", [id])
            .then((rowFound) => {
                if (!rowFound[0]) {
                    resolve("Request not found!");
                    return;
                }
                knex_db
                    .raw(
                        "DELETE FROM friends WHERE status = 'PENDING' AND id = ?",
                        [id]
                    )
                    .then(() => {
                        resolve("Request deleted successfully!");
                    })
                    .catch((error) => {
                        console.error(error);
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

//Update this method to complete the challenge4.a
async function viewFriends(id) {
    try {
        let friends = [];
        const friendsAccepted = await knex_db("friends")
            .select("id", "status", "sender_id", "recipient_id")
            .where(function () {
                this.where("sender_id", id).orWhere("recipient_id", id);
            })
            .andWhere({ status: "ACCEPTED" });

        for (const friend of friendsAccepted) {
            const { sender_id, recipient_id } = friend;
            if (id !== recipient_id) {
                const friendDetails = await userRepository.getUser(
                    recipient_id
                );
                friendDetails.reqId = friend.id;
                friends.push(friendDetails);
            } else if (id !== sender_id) {
                const friendDetails = await userRepository.getUser(sender_id);
                friendDetails.reqId = friend.id;
                friends.push(friendDetails);
            }
        }

        return friends;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    init,
    getSuggestedFriends,
    sendReq,
    viewSentReqs,
    viewPendingReqs,
    acceptReq,
    rejectReq,
    viewFriends,
};
