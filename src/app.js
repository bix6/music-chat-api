require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { NODE_ENV } = require("./config");
const validateBearerToken = require("./validate-bearer-token");
const errorHandler = require("./error-handler");
const chatroomsRouter = require("../src/chatrooms/chatrooms-router");
const messagesRouter = require("../src/messages/messages-router");
const personsRouter = require("../src/persons/persons-router");
// const logger = require('./logger');

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);
app.use(cookieParser());

app.use("/api/chatrooms", chatroomsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/persons", personsRouter);

app.use(errorHandler);

module.exports = app;
