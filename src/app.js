require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const validateBearerToken = require("./validate-bearer-token");
const errorHandler = require("./error-handler");
const foldersRouter = require("../src/folders/folders-router");
const chatroomsRouter = require("../src/chatrooms/chatrooms-router");
// const logger = require('./logger');

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
// app.use(validateBearerToken);

app.get("/", (req, res) => {
  res.send("Hello, Jello!");
});

app.use("/api/folders", foldersRouter);
app.use("/api/chatrooms", chatroomsRouter);

app.use(errorHandler);

module.exports = app;
