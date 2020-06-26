const MessagesService = {
  getByChatroomId(knex, chatroom_id) {
    return knex("message").select("*").where({ chatroom_id });
  },
};

module.exports = MessagesService;
