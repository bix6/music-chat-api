const express = require("express");
const xss = require("xss");
const path = require("path");
const MessagesService = require("./messages-service");

module.exports = function (io) {
  const messagesRouter = express.Router();
  const jsonParser = express.json();

  // socket setup and logic
  const emitMessage = (msg) => {
    io.emit("emit message from server", msg);
  };

  io.on("connection", (socket) => {
    console.log();
    console.log(socket.client.id + " connected");
    console.log();

    socket.on("emit message from client", (msg) => {
      console.log("chat message: ", msg);
      emitMessage(msg);
    });
  });

  const sanitizeMessage = (message) => ({
    id: message.id,
    content_type: xss(message.content_type),
    message: xss(message.message),
    content_id: xss(message.content_id),
    chatroom_id: xss(message.chatroom_id),
    person_id: xss(message.person_id),
    username: xss(message.name),
  });

  messagesRouter.route("/:message_id").get((req, res, next) => {
    MessagesService.getByMessageId(req.app.get("db"), req.params.message_id)
      .then((messages) => {
        res.json(messages.map(sanitizeMessage));
      })
      .catch(next);
  });

  messagesRouter.route("/chatroom/:chatroom_id").get((req, res, next) => {
    MessagesService.getByChatroomId(req.app.get("db"), req.params.chatroom_id)
      .then((message) => {
        res.json(message.map(sanitizeMessage));
      })
      .catch(next);
  });

  messagesRouter.route("/").post(jsonParser, (req, res, next) => {
    const {
      content_type,
      message,
      content_id,
      chatroom_id,
      person_id,
    } = req.body;
    const newMessage = {
      content_type,
      message,
      content_id,
      chatroom_id,
      person_id,
    };

    for (const [key, value] of Object.entries(newMessage)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    }
    // This is needed to remove the username from the payload
    // so the insert doesn't throw an error.
    // The username is only needed for the GET
    const noUsernameMessage = sanitizeMessage(newMessage);
    delete noUsernameMessage["username"];

    MessagesService.insertMessage(req.app.get("db"), noUsernameMessage)
      .then((message) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${message.id}`))
          .json(sanitizeMessage(message));
      })
      .catch(next);
  });

  return messagesRouter;
};
