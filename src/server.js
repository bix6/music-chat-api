const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");

// TODO WebSocket
// Setup for WebSocket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
});

app.set("db", db);

// TODO WebSocket
// Test WebSocket connection
// This is not logging currently
io.on("connection", (socket) => {
  console.log("user connected");
});

// TODO WebSocket
// I switched this to http instead of app based on the example
http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
