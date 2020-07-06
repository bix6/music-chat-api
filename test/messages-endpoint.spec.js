const knex = require("knex");
const app = require("../src/app");
const {
  makePersonArray,
  makePerson,
  makeChatroomArray,
  makeChatroom,
  makeMessageArray,
  makeMessage,
} = require("./chat.fixtures.js");
const { expect } = require("chai");

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

  describe("GET /api/messages/{message_id}", () => {
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

      it("responds with 200 and message", () => {
        return supertest(app)
          .get("/api/messages/1")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200);
      });
    });
  });

  describe("GET /api/messages/chatroom/{chatroom_id}", () => {
    context("Given no messages", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/messages/chatroom/1")
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

      it("responds with 200 and messages", () => {
        return supertest(app)
          .get("/api/messages/chatroom/1")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200);
      });
    });
  });

  describe("POST /api/messages", () => {
    const testChatroom = makeChatroom();
    const testPerson = makePerson();
    const testMessage = makeMessage();

    context("Given no messages, 1 chatroom and 1 user", () => {
      beforeEach("insert person and message", () => {
        return db("person")
          .insert(testPerson)
          .then(() => {
            return db("chatroom").insert(testChatroom);
          });
      });
      it("inserts message, responds with 201 and id", () => {
        return supertest(app)
          .post("/api/messages")
          .send(testMessage)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property("id");
            expect(res.body.message).to.eql(testMessage.message);
            expect(res.headers.location).to.eql(
              `/api/messages/${res.body.chatroom_id}`
            );
          });
      });

      const requiredFields = [
        "content_type",
        "message",
        "content_id",
        "chatroom_id",
        "person_id",
      ];

      requiredFields.forEach((field) => {
        const newMessage = makeMessage();

        it("responds with 400 when required fields are missing", () => {
          delete newMessage[field];

          return supertest(app)
            .post("/api/messages")
            .send(newMessage)
            .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(400, {
              error: { message: `Missing ${field} in request body` },
            });
        });
      });
    });
  });
});
