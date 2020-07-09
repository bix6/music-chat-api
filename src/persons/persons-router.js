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
  console.log("persons id", req.cookies);
  PersonsService.getById(req.app.get("db"), req.params.id)
    .then((person) => {
      res.json(person.map(sanitizePerson));
    })
    .catch(next);
});

personsRouter.route("/name/:name").get((req, res, next) => {
  console.log("persons name", req.cookies);
  PersonsService.getByName(req.app.get("db"), req.params.name)
    .then((person) => {
      if (person) {
        res.json(sanitizePerson(person));
      } else {
        res.json([]);
      }
    })
    .catch(next);
});

personsRouter.route("/").post(jsonParser, (req, res, next) => {
  const { name } = req.body;
  const newPerson = { name };

  for (const [key, value] of Object.entries(newPerson)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing ${key} in request body` },
      });
    }
  }

  PersonsService.insertPerson(req.app.get("db"), sanitizePerson(newPerson))
    .then((person) => {
      res
        .status(201)
        .cookie("test", "testBix", { expire: 600000 + Date.now() })
        .location(path.posix.join(req.originalUrl, `/id/${person.id}`))
        .json(sanitizePerson(person));
    })
    .catch(next);
});

module.exports = personsRouter;
