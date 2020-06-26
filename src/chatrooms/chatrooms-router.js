const express = require("express");
const xss = require("xss");
const ChatroomsService = require("./chatrooms-service");

const chatroomsRouter = express.Router();

const sanitizeChatroom = (chatroom) => ({
  id: xss(chatroom.id),
  name: xss(chatroom.name),
  description: xss(chatroom.description),
});

chatroomsRouter.route("/").get((req, res, next) => {
  ChatroomsService.getAllChatrooms(req.app.get("db"))
    .then((chatrooms) => {
      res.json(chatrooms.map(sanitizeChatroom));
    })
    .catch(next);
});

module.exports = chatroomsRouter;
