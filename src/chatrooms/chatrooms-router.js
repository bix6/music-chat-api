const express = require("express");
const xss = require("xss");
const path = require("path");
const ChatroomsService = require("./chatrooms-service");

const chatroomsRouter = express.Router();
const jsonParser = express.json();

const sanitizeChatroom = (chatroom) => ({
  id: chatroom.id,
  name: xss(chatroom.name),
  description: xss(chatroom.description),
});

chatroomsRouter
  .route("/")
  .get((req, res, next) => {
    ChatroomsService.getAllChatrooms(req.app.get("db"))
      .then((chatrooms) => {
        res.json(chatrooms.map(sanitizeChatroom));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, description } = req.body;
    const newChatroom = { name, description };

    for (const [key, value] of Object.entries(newChatroom)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    }

    ChatroomsService.insertChatroom(
      req.app.get("db"),
      sanitizeChatroom(newChatroom)
    )
      .then((chatroom) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${chatroom.id}`))
          .json(sanitizeChatroom(chatroom));
      })
      .catch(next);
  });

module.exports = chatroomsRouter;
