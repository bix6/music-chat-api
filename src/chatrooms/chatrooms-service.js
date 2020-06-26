const ChatroomsService = {
  getAllChatrooms(knex) {
    return knex("chatroom").select("*");
  },
  insertChatroom(knex, newChatroom) {
    return knex("chatroom")
      .insert(newChatroom)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ChatroomsService;
