/**
 * This comment is required for the VS Code Jest Plugin to work.
 * @jest-environment jsdom
 */
import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import FriendshipStatus from "../src/enums/friendshipStatus.js";

var testSession = null;

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

describe("Post authentication tasks", () => {
  var authenticatedSession = null;
  var authenticatedUserId = null;
  beforeAll(
    async () =>
      await testBase.authenticateTestSession(testSession).then((userId) => {
        authenticatedSession = testSession;
        authenticatedUserId = userId;
      })
  );
  test("Challenge 4.a - Return an array of friends", async () => {
    await db("friends")
      .update({
        sender_id: 5,
        recipient_id: 6,
        status: FriendshipStatus.ACCEPTED,
      })
      .where("id", 4);

    const res1 = await authenticatedSession.get(
      `/api/friends/${authenticatedUserId}`
    );

    expect(res1.status).toBe(200);
    const parsedResponse1 = JSON.parse(res1.text);
    const user1 = parsedResponse1.response;

    expect(user1).toEqual([
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
        reqId: 2
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
          { name: "Video Games", rate: 1 },
          { name: "Gym", rate: 5 },
          { name: "Rap", rate: 5 },
        ],
        skills: [
          { name: "Dancing", rate: 3 },
          { name: "Docker", rate: 5 },
        ],
        reqId: 4
      },
    ]);

    const res2 = await authenticatedSession.get(`/api/friends/3`);

    expect(res2.status).toBe(200);
    const parsedResponse2 = JSON.parse(res2.text);
    const user2 = parsedResponse2.response;

    expect(user2).toEqual([
      {
        id: 6,
        email: "liyana@hacktitude.io",
        gender: "Female",
        firstname: "Liyana",
        lastname: "Tan",
        image_url:
          "https://i.pinimg.com/originals/29/a8/20/29a82067b71bd9e3df95e1c0ba5c4daf.jpg",
        hobbies: [
          { name: "Soccer", rate: 4 },
          { name: "Coding", rate: 5 },
          { name: "Music", rate: 3 },
        ],
        skills: [
          { name: "Java", rate: 3 },
          { name: "Javascript", rate: 4 },
          { name: "Photography", rate: 3 },
        ],
        reqId: 2
      },
    ]);
  });
});
