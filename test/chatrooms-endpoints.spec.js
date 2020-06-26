const knex = require("knex");
const app = require("../src/app");
const { makeChatroomArray } = require("./chat.fixtures.js");

describe("Chatrooms Endpoint", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean tables", () =>
    db.raw("TRUNCATE message, chatroom, person RESTART IDENTITY CASCADE")
  );

  afterEach("clean tables", () =>
    db.raw("TRUNCATE message, chatroom, person RESTART IDENTITY CASCADE")
  );

  describe("GET /api/chatrooms", () => {
    context("Given no chatrooms", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get("/api/chatrooms").expect(200, []);
      });
    });

    context("Given chatrooms", () => {
      const testChatrooms = makeChatroomArray();

      beforeEach("insert chatrooms", () => {
        return db("chatroom").insert(testChatrooms);
      });

      it("responds with 200 and all chatrooms", () => {
        return supertest(app).get("/api/chatrooms").expect(200);
      });
    });
  });
});
