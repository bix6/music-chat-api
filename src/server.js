const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");

// WebSocket Setup
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const db = knex({
  client: "pg",
  connection: DATABASE_URL,
});

app.set("db", db);

// TODO WebSocket
io.on("connection", (socket) => {
  console.log(socket.client.id + " connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
