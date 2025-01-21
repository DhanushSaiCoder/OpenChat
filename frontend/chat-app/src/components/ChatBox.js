import React, { useState } from 'react';
import '../styles/ChatBox.css';

const ChatBox = ({ messageData, userName,  userId }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Handle input change
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // Handle message send
    const handleSendMessage = async () => {
        if (!message.trim()) return; // Don't send empty messages
        const token = localStorage.getItem('token')
        setIsSending(true); // Start the sending process
        try {
            const response = await fetch(`/message/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                    // Add any other headers like authorization token if needed
                },
                
                body: JSON.stringify({ message }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                // After sending the message, clear the input field and update the chat
                setMessage('');
                // Optionally, update the messageData here (if you are managing state locally)
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
        setIsSending(false); // End sending process
    };

    return (
        <div className="ChatBox">
            {!messageData.length && !userName && <p>Click on a user to chat</p>}
            {messageData && userName && (
                <>
                    <div id="chatBoxHeader">
                        <h2>{userName}</h2>
                    </div>
                    <div id="chatBoxContent">
                        {messageData.map((e, index) => (
                            <div key={index} className={`messageDiv ${e.sender === 'user' ? 'senderMsg' : 'receiverMsg'}`}>
                                <div className="messageStyleDiv">
                                    <p className="message">{e.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div id="newMsgDiv">
                        <input
                            type="text"
                            id="messageInput"
                            placeholder="Type a message..."
                            value={message}
                            onChange={handleMessageChange}
                        />
                        <button id="sendButton" onClick={handleSendMessage} disabled={isSending}>
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatBox;
