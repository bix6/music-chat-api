const express = require("express");
const xss = require("xss");
const path = require("path");
const MessagesService = require("./messages-service");

const messagesRouter = express.Router();

const sanitizeMessage = (message) => ({
  id: xss(message.id),
  content_type: xss(message.content_type),
  message: xss(message.message),
  content_id: xss(message.content_id),
  chatroom_id: xss(message.chatroom_id),
  person_id: xss(message.person_id),
});

messagesRouter.route("/:chatroom_id").get((req, res, next) => {
  MessagesService.getByChatroomId(req.app.get("db"), req.params.chatroom_id)
    .then((messages) => {
      res.json(messages.map(sanitizeMessage));
    })
    .catch(next);
});

module.exports = messagesRouter;
