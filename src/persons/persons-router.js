const express = require("express");
const xss = require("xss");
const path = require("path");
const PersonsService = require("./persons-service");

const personsRouter = express.Router();
const jsonParser = express.json();

const sanitizePerson = (person) => ({
  id: person.id,
  name: xss(person.name),
});

personsRouter.route("/id/:id").get((req, res, next) => {
  PersonsService.getById(req.app.get("db"), req.params.id)
    .then((person) => {
      res.json(person.map(sanitizePerson));
    })
    .catch(next);
});
/*
  .get((req, res, next) => {
    PersonsService.getAllChatrooms(req.app.get("db"))
      .then((chatrooms) => {
        res.json(chatrooms.map(sanitizePerson));
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

    PersonsService.insertChatroom(
      req.app.get("db"),
      sanitizePerson(newChatroom)
    )
      .then((chatroom) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${chatroom.id}`))
          .json(sanitizePerson(chatroom));
      })
      .catch(next);
  });
  */
module.exports = personsRouter;
