const MessagesService = {
  getByChatroomId(knex, chatroom_id) {
    return knex("message")
      .select("*")
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
