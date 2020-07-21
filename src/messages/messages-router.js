const express = require("express");
const xss = require("xss");
const path = require("path");
const MessagesService = require("./messages-service");

module.exports = function (io) {
  const messagesRouter = express.Router();
  const jsonParser = express.json();

  // TODO socket
  var sendResponse = () => {};

  io.on("connection", (socket) => {
    console.log();
    console.log(socket.client.id + " connected");
    console.log();

    socket.on("connected", (data) => {
      // TODO
      // listen to event at any time (not just when endpoint is called)
      // execute some code
    });

    socket.on("chat message", (data) => {
      console.log("chat message, data: ", data);
      sendResponse(data);
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
        // https://stackoverflow.com/questions/56219098/make-socket-io-work-within-an-api-endpoint-in-node-js
        // The send response and res logic is going to need some work
        // TODO
        sendResponse = (data) => {
          io.emit("chat message", data);
        };
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${message.id}`))
          .json(sanitizeMessage(message));
      })
      .catch(next);
  });

  return messagesRouter;
};

// TODO
// module.exports = messagesRouter;
