const knex = require("knex");
const app = require("../src/app");
const {
  makePersonArray,
  makeChatroomArray,
  makeMessageArray,
} = require("./fixtures/chatPage.fixtures.js");

describe.skip("Messages Endpoint", function () {
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

  describe("GET /api/messages", () => {
    context("Given no messages", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get("/api/messages").expect(200, []);
      });
    });
  });
});
