const knex = require("knex");
const app = require("../src/app");
const {
  makePersonArray,
  makeChatroomArray,
  makeMessageArray,
} = require("./chat.fixtures.js");

describe("Messages Endpoint", function () {
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

  describe("GET /api/messages/{chatroom_id}", () => {
    context("Given no messages", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/messages/1")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });

    context("Given messages", () => {
      const testPersons = makePersonArray();
      const testChatrooms = makeChatroomArray();
      const testMessages = makeMessageArray();

      beforeEach("insert persons, chatrooms and messages", () => {
        return db("person")
          .insert(testPersons)
          .then(() => {
            return db("chatroom")
              .insert(testChatrooms)
              .then(() => {
                return db("message").insert(testMessages);
              });
          });
      });

      it("responds with 200 and messages for specified chatroom", () => {
        return supertest(app)
          .get("/api/messages/1")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200);
      });
    });
  });
});
