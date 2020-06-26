const ChatroomsService = {
  getAllChatrooms(knex) {
    return knex("chatroom").select("*");
  },
};

module.exports = ChatroomsService;
