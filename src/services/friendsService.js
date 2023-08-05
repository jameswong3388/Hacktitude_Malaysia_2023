import httpStatus from "../enums/httpStatus.js";
import userRepository from "../repositories/userRepository.js";
import dbConnection from "../../sqlite.js";
import friendsRepository from "../repositories/friendsRepository.js";

//initialize db connection
function initializeApp() {
  dbConnection
    .getDbConnection()
    .then((db) => {
      friendsRepository.init(db);
    })
    .catch((err) => {
      console.error("Error initializing the application:", err);
      process.exit(1); // Exit the application or handle the error appropriately
    });
}

async function getSuggestedFriends(id) {
  const response = await friendsRepository.getSuggestedFriends(id);
  if (response === "User not found!") {
    return { status: httpStatus.FORBIDDEN };
  } else if (response === undefined) {
    return { status: httpStatus.UNAUTHORIZED };
  } else {
    return { response: response, status: httpStatus.OK };
  }
}

async function sendReq(data) {
  return await friendsRepository.sendReq(data);
}

async function viewSentReqs(id) {
  const response = await friendsRepository.viewSentReqs(id);
  return { response: response, status: httpStatus.OK };
}

async function viewPendingReqs(id) {
  const response = await friendsRepository.viewPendingReqs(id);
  return { response: response, status: httpStatus.OK };
}

async function acceptReq(id) {
  const response = await friendsRepository.acceptReq(id);
  return { response: response, status: httpStatus.OK };
}

async function rejectReq(id) {
  const response = await friendsRepository.rejectReq(id);
  return { response: response, status: httpStatus.OK };
}

async function viewFriends(id) {
  const response = await friendsRepository.viewFriends(id);
  return { response: response, status: httpStatus.OK };
}

initializeApp();
export default {
  initializeApp,
  getSuggestedFriends,
  sendReq,
  viewSentReqs,
  viewPendingReqs,
  acceptReq,
  rejectReq,
  viewFriends,
};
