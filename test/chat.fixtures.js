function makePersonArray() {
  return [
    {
      id: "1",
      name: "bix",
    },
    {
      id: "2",
      name: "alicia",
    },
  ];
}

function makeChatroomArray() {
  return [
    {
      id: "1",
      name: "Global",
      description: "Welcome to the World Wide Music Chat!",
    },
    {
      id: "2",
      name: "Mood",
      description: "How do you feel today?",
    },
  ];
}

function makeMessageArray() {
  return [
    {
      id: "1",
      content_type: "text",
      message: "Music Chat, Baby",
      content_id: "",
      chatroom_id: "1",
      person_id: "2",
    },
    {
      id: "2",
      content_type: "text",
      message: "You Don't Know my Name",
      content_id: "",
      chatroom_id: "1",
      person_id: "1",
    },
    {
      id: "3",
      content_type: "youtube video",
      message: "",
      content_id: "rywUS-ohqeE",
      chatroom_id: "1",
      person_id: "2",
    },
    {
      id: "4",
      content_type: "text",
      message: "My mood is sassy",
      content_id: "",
      chatroom_id: "2",
      person_id: "1",
    },
    {
      id: "5",
      content_type: "text",
      message: "I'm so chilled out",
      content_id: "",
      chatroom_id: "2",
      person_id: "2",
    },
  ];
}

module.exports = { makePersonArray, makeChatroomArray, makeMessageArray };
