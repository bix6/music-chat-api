const express = require("express");
const xss = require("xss");
const path = require("path");
const MessagesService = require("./messages-service");

const messagesRouter = express.Router();
const jsonParser = express.json();

const sanitizeMessage = (message) => ({
  id: message.id,
  content_type: xss(message.content_type),
  message: xss(message.message),
  content_id: xss(message.content_id),
  chatroom_id: xss(message.chatroom_id),
  person_id: xss(message.person_id),
  username: xss(message.name),
});

messagesRouter.route("/:chatroom_id").get((req, res, next) => {
  MessagesService.getByChatroomId(req.app.get("db"), req.params.chatroom_id)
    .then((messages) => {
      res.json(messages.map(sanitizeMessage));
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
  // So the insert doesn't throw an error
  // the username is only needed for the GET
  const noUsernameMessage = sanitizeMessage(newMessage);
  delete noUsernameMessage["username"];

  MessagesService.insertMessage(req.app.get("db"), noUsernameMessage)
    .then((message) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${message.chatroom_id}`))
        .json(sanitizeMessage(message));
    })
    .catch(next);
});

module.exports = messagesRouter;
