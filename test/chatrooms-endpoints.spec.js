const knex = require("knex");
const app = require("../src/server");
const { makeChatroomArray, makeChatroom } = require("./chat.fixtures.js");
const supertest = require("supertest");
const { expect } = require("chai");

describe("Chatrooms Endpoint", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
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
        return supertest(app)
          .get("/api/chatrooms")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });

    context("Given chatrooms", () => {
      const testChatrooms = makeChatroomArray();

      beforeEach("insert chatrooms", () => {
        return db("chatroom").insert(testChatrooms);
      });

      it("responds with 200 and all chatrooms", () => {
        return supertest(app)
          .get("/api/chatrooms")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200);
      });
    });
  });

  describe("POST /api/chatrooms", () => {
    const testChatroom = makeChatroom();

    context("Given no entries", () => {
      it("inserts chatroom, responds with 201 and id", () => {
        return supertest(app)
          .post("/api/chatrooms")
          .send(testChatroom)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property("id");
            expect(res.body.name).to.eql(testChatroom.name);
            expect(res.headers.location).to.eql(
              `/api/chatrooms/${res.body.id}`
            );
          });
      });

      const requiredFields = ["name", "description"];

      requiredFields.forEach((field) => {
        const newChatroom = makeChatroom();

        it("responds with 400 when required fields are missing", () => {
          delete newChatroom[field];

          return supertest(app)
            .post("/api/chatrooms")
            .send(newChatroom)
            .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(400, {
              error: { message: `Missing ${field} in request body` },
            });
        });
      });
    });
  });
});
