import React, { Component } from 'react';
import '../styles/ChatBox.css'
const ChatBox = ({
    messageData,
    userName
}) => {
    return (
        <div className='ChatBox'>
            {!messageData.length && userName == '' && (
                <p>Click on a user to chat</p>
            )}
            {messageData && userName && (
                <>
                    <div id='chatBoxHeader'>
                        <h2>{userName}</h2>
                    </div>
                    <div id='chatBoxContent'>
                        {messageData.map((e, index) => {
                            return (
                                <div key={index} className={`messageDiv ${e.sender === 'user' ? 'senderMsg' : 'receiverMsg'}`}>
                                    <div className='messageStyleDiv'>
                                        <p className='message'>{e.message}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    <div id="newMsgDiv">
                        <input type="text" id="messageInput" placeholder="Type a message..." />
                        <button id="sendButton">Send</button>
                    </div>

                </>
            )}
        </div>
    );
}

export default ChatBox;