/**
 * This comment is required for the VS Code Jest Plugin to work.
 * @jest-environment jsdom
 */

import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import bcrypt from "bcrypt";

var testSession = null;
const users = [
  {
    id: 1,
    email: "siu@cr7.com",
    gender: "Male",
    firstname: "Cristiano",
    lastname: "Ronaldo",
    image_url:
      "https://www.irishtimes.com/resizer/geEGpNJqT_hxa139T5HWfq8YdYw=/1600x0/filters:format(jpg):quality(70)/cloudfront-eu-central-1.images.arcpublishing.com/irishtimes/C752OG447LSTHDRHTADVXYWCPQ.jpg",
    hobbies: [
      { name: "Gym", rate: 4 },
      { name: "Soccer", rate: 5 },
      { name: "Sports", rate: 3 },
    ],
    skills: [
      { name: "C++", rate: 4 },
      { name: "Java", rate: 5 },
      { name: "Python", rate: 3 },
    ],
  },
  {
    id: 2,
    email: "ney@nj.com",
    gender: "Male",
    firstname: "Neymar",
    lastname: "Jr.",
    image_url:
      "https://pbs.twimg.com/media/EK-YsU9XYAU7R-o?format=jpg&name=medium",
    hobbies: [
      { name: "Music", rate: 1 },
      { name: "Soccer", rate: 5 },
      { name: "Video Games", rate: 2 },
    ],
    skills: [
      { name: "Javascript", rate: 5 },
      { name: "Photography", rate: 4 },
    ],
  },
  {
    id: 3,
    email: "laflame@cactusjack.com",
    gender: "Female",
    firstname: "Travis",
    lastname: "Scott",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Travis_Scott_-_Openair_Frauenfeld_2019_08.jpg/500px-Travis_Scott_-_Openair_Frauenfeld_2019_08.jpg",
    hobbies: [{ name: "Music", rate: 5 }],
    skills: [{ name: "Java", rate: 2 }],
  },
  {
    id: 4,
    email: "test@test.com",
    gender: "Male",
    firstname: "Mister",
    lastname: "X",
    image_url:
      "https://th.bing.com/th/id/R.9361b3213e181ebaa3f6282d02fab077?rik=VNRw0lKt92xneA&pid=ImgRaw&r=0",
    hobbies: [
      { name: "Gym", rate: 5 },
      { name: "Rap", rate: 2 },
      { name: "Sports", rate: 3 },
      { name: "Video Games", rate: 5 },
    ],
    skills: [
      { name: "Ruby", rate: 4 },
      { name: "Singing", rate: 5 },
    ],
  },
  {
    id: 5,
    email: "random@user.com",
    gender: "Female",
    firstname: "Thomas",
    lastname: "A. Anderson",
    image_url:
      "https://th.bing.com/th/id/OIP.bEl-isZYhCmzsIGyhdEatgHaEK?pid=ImgDet&rs=1",
    hobbies: [
      { name: "Gym", rate: 5 },
      { name: "Rap", rate: 5 },
      { name: "Video Games", rate: 1 },
    ],
    skills: [
      { name: "Dancing", rate: 3 },
      { name: "Docker", rate: 5 },
    ],
  },
  {
    id: 6,
    email: "liyana@hacktitude.io",
    gender: "Female",
    firstname: "Liyana",
    lastname: "Tan",
    image_url:
      "https://i.pinimg.com/originals/29/a8/20/29a82067b71bd9e3df95e1c0ba5c4daf.jpg",
    hobbies: [
      { name: "Coding", rate: 5 },
      { name: "Music", rate: 3 },
      { name: "Soccer", rate: 4 },
    ],
    skills: [
      { name: "Java", rate: 3 },
      { name: "Javascript", rate: 4 },
      { name: "Photography", rate: 3 },
    ],
  },
];

/**
 * Create a super test session and initiate the database before running tests.
 */
beforeAll(async () => {
  testSession = testBase.createSuperTestSession(app);
  await testBase.resetDatabase(db);
});

/**
 * Reset the database after every test case
 */
afterEach(async () => {
  await testBase.resetDatabase(db);
});

/**
 * Take down the app once test execution is done
 */
afterAll((done) => {
  app.close(done);
});

describe("Post authentication tasks 1.a", () => {
  var authenticatedSession = null;
  var authenticatedUserId = null;
  beforeAll(
    async () =>
      await testBase.authenticateTestSession(testSession).then((userId) => {
        authenticatedSession = testSession;
        authenticatedUserId = userId;
      })
  );

  test("Challenge 1.a - Getting users", async () => {
    const allUsers = await authenticatedSession.get(`/api/users`);

    const parsedResponse = JSON.parse(allUsers.text);
    const responseArray = parsedResponse.response;
    expect(responseArray.length).toEqual(users.length);
    expect(responseArray[1]).toEqual(users[1]);
  });
});

describe("Post authentication tasks 1.b", () => {
  var authenticatedSession = null;
  var authenticatedUserId = null;
  beforeAll(
    async () =>
      await testBase.authenticateTestSession(testSession).then((userId) => {
        authenticatedSession = testSession;
        authenticatedUserId = userId;
      })
  );

  test("Challenge 1.b - User not found! for a non-existing user ID", async () => {
    const userId = 999;
    const result = await authenticatedSession.get(`/api/users/${userId}`);
    expect(result.text.includes("User Not Found")).toBe(true);
  });
});
