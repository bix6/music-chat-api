require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const validateBearerToken = require("./validate-bearer-token");
const errorHandler = require("./error-handler");
const chatroomsRouter = require("../src/chatrooms/chatrooms-router");
const personsRouter = require("../src/persons/persons-router");
const knex = require("knex");
const { PORT, DATABASE_URL, NODE_ENV, CLIENT_ORIGIN } = require("./config");

// Setup app
const app = express();
// Then setup Socket
const server = require("http").Server(app);
const io = require("socket.io")(server);
const messagesRouter = require("../src/messages/messages-router")(io);

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
});

app.set("db", db);

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);

app.use("/api/chatrooms", chatroomsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/persons", personsRouter);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

module.exports = app;
