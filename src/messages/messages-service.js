const MessagesService = {
  getByChatroomId(knex, chatroom_id) {
    return knex("message").select("*").where({ chatroom_id });
  },
  insertMessage(knex, message) {
    return knex("message")
      .insert(message)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = MessagesService;
