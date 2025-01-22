//SETUP SOCKET

    // get the conversationId with two user ids

    //when a message is created - raises an event [newMsg] with message, conversationId
    //when server listens [newMsg] - it broadcasts to all users incl curr user an event [checkMsgs]

    //when clients listens [checkMsgs] - fetches the messages again from the database
