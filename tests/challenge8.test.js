/**
 * This comment is required for the VS Code Jest Plugin to work.
 * @jest-environment jsdom
 */
import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";

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

    test("Challenge 8.a - Add document record into colab_shared_docs table", async () => {
        const res = await authenticatedSession.post("/api/colab/add-doc-group").send({
            file_name: "newImage.jpg", 
            file_desc: "This is an image file", 
            file_path: "/fakepath/newImage.jpg", 
            user_id: 3, 
            group_id: 1
        });
        expect(res.status).toBe(200);
        expect(res.text.includes("success")).toBe(true);
    });

    test("Challenge 8.b - Get all of the shared documents based on group id from colab_shared_docs table at DB", async () => {
        await db("colab_shared_docs").insert(
            {
                file_name: "newImage.jpg", 
                file_desc: "This is an image file", 
                file_path: "/fakepath/newImage.jpg", 
                user_id: 3, 
                group_id: 1
            }
        );
        let group_id = 1;
        const result = await authenticatedSession.get(`/api/colab/find-shared-docs/${group_id}`)
        expect(result.status).toBe(200);
        const parsedResponse1 = JSON.parse(result.text);
        const responseArray1 = parsedResponse1.response;
        expect(responseArray1.length).toBe(4);
    });
});
