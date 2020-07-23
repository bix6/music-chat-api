# Music Chat API

## About

This is the API for [Music Chat](https://github.com/bix6/music-chat). It's built with Express, Node.js, PostgreSQL and WebSockets (socket.io).

## Setup

Sample `.env` file

```
NODE_ENV=development
PORT=8000
API_TOKEN=TODOuuid
DATABASE_URL="postgresql://TODOuname:pw@localhost/music_chat"
TEST_DATABASE_URL="postgresql://TODOuname:pw@localhost/music_chat_test"
CLIENT_ORIGIN="http://localhost:3000"
```

## Routes

### `/api/chatrooms`

- `GET /` - get list of all chatrooms
- `POST /` - post a new chatroom

### `/api/messages`

- `GET /:message_id` - get a message by id
- `GET /chatroom/:chatroom_id` - get all messages for a given chatroom
- `POST /` - post a new message

### `/api/persons`

- `GET /id/:id` - get person by id
- `GET /name/:name` - get person by name
- `POST /` - post a new person
