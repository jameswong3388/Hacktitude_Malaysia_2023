/**
 * This comment is required for the VS Code Jest Plugin to work.
 * @jest-environment jsdom
 */
import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";

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
  test("Challenge 2.a - Return suggestions based on hobbies", async () => {
    const userId1 = 6;
    const suggestedFriends1 = await authenticatedSession.get(
      `/api/friends/${userId1}/suggestions`
    );

    const parsedResponse1 = JSON.parse(suggestedFriends1.text);
    const responseArray1 = parsedResponse1.response;
    const expectedSuggestions1 = [
      {
        id: 1,
        email: "siu@cr7.com",
        firstname: "Cristiano",
        gender: "Male",
        lastname: "Ronaldo",
        image_url:
          "https://www.irishtimes.com/resizer/geEGpNJqT_hxa139T5HWfq8YdYw=/1600x0/filters:format(jpg):quality(70)/cloudfront-eu-central-1.images.arcpublishing.com/irishtimes/C752OG447LSTHDRHTADVXYWCPQ.jpg",
        hobbies: [
          {
            name: "Gym",
            rate: 4,
          },
          {
            name: "Soccer",
            rate: 5,
          },
          {
            name: "Sports",
            rate: 3,
          },
        ],
        skills: [
          {
            name: "C++",
            rate: 4,
          },
          {
            name: "Java",
            rate: 5,
          },
          {
            name: "Python",
            rate: 3,
          },
        ],
      },
      {
        id: 2,
        email: "ney@nj.com",
        firstname: "Neymar",
        gender: "Male",
        lastname: "Jr.",
        image_url:
          "https://pbs.twimg.com/media/EK-YsU9XYAU7R-o?format=jpg&name=medium",
        hobbies: [
          {
            name: "Music",
            rate: 1,
          },
          {
            name: "Soccer",
            rate: 5,
          },
          {
            name: "Video Games",
            rate: 2,
          },
        ],
        skills: [
          {
            name: "Javascript",
            rate: 5,
          },
          {
            name: "Photography",
            rate: 4,
          },
        ],
      },
    ];
    expect(responseArray1).toEqual(expectedSuggestions1);

    const userId2 = 3;
    const suggestedFriends2 = await authenticatedSession.get(
      `/api/friends/${userId2}/suggestions`
    );

    const parsedResponse2 = JSON.parse(suggestedFriends2.text);
    const responseArray2 = parsedResponse2.response;
    const expectedSuggestions2 = [
      {
        id: 2,
        email: "ney@nj.com",
        firstname: "Neymar",
        gender: "Male",
        lastname: "Jr.",
        image_url:
          "https://pbs.twimg.com/media/EK-YsU9XYAU7R-o?format=jpg&name=medium",
        hobbies: [
          {
            name: "Music",
            rate: 1,
          },
          {
            name: "Soccer",
            rate: 5,
          },
          {
            name: "Video Games",
            rate: 2,
          },
        ],
        skills: [
          {
            name: "Javascript",
            rate: 5,
          },
          {
            name: "Photography",
            rate: 4,
          },
        ],
      },
    ];
    expect(responseArray2).toEqual(expectedSuggestions2);
  });
});
