import httpStatus from "../enums/httpStatus.js";
import authRepository from "../repositories/authRepository.js";
import dbConnection from "../../sqlite.js";

//initialize db connection
function initializeApp() {
  dbConnection
    .getDbConnection()
    .then((db) => {
      authRepository.init(db);
    })
    .catch((err) => {
      console.error("Error initializing the application:", err);
      process.exit(1); // Exit the application or handle the error appropriately
    });
}

async function signup(data) {
  const response = await authRepository.signup(data);
  if (response === "Try another email address") {
    return { status: httpStatus.FORBIDDEN };
  } else if (response === undefined) {
    return { status: httpStatus.UNAUTHORIZED };
  } else {
    return { response: response, status: httpStatus.OK };
  }
}

async function login(data) {
  return await authRepository.login(data);
}

initializeApp();
export default { signup, login };
