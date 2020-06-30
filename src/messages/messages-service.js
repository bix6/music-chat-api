const MessagesService = {
  getByChatroomId(knex, chatroom_id) {
    return knex("message")
      .select(
        "message.id",
        "message.content_type",
        "message.message",
        "message.content_id",
        "message.chatroom_id",
        "message.person_id",
        "person.name"
      )
      .where({ chatroom_id })
      .join("person", "message.person_id", "=", "person.id");
  },
  insertMessage(knex, message) {
    console.log("service obj", message);
    return knex("message")
      .insert(message)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = MessagesService;
