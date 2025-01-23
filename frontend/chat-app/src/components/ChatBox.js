import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import '../styles/ChatBox.css';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const ChatBox = ({ messageData = [], userName = 'Unknown', userId, conversationId }) => {
    const [messages, setMessages] = useState(messageData);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const chatBoxContentRef = useRef(null);
    const token = localStorage.getItem('token');

    // Fetch messages callback
    const fetchMessages = useCallback(async () => {
        try {
            console.log('fetching messages')

            const response = await fetch(`http://localhost:5000/message/${userId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });``

            if (response.ok) {
                const data = await response.json();
                const formattedMessages = data.map((msg) => ({
                    message: msg.message,
                    sender: msg.reciverId === userId ? 'user' : 'otherUser',
                }));
                setMessages(formattedMessages);
            } else {
                console.error('Error fetching messages:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [userId, token]);

    // Listen for new messages and fetch them
    useEffect(() => {
        fetchMessages();

        const messageListener = (convId) => {

            if (convId === conversationId) {
                fetchMessages();   
            }
        };
        socket.on('checkMsgs', messageListener);

        return () => {
            socket.off('checkMsgs', messageListener);
        };
    }, [conversationId, fetchMessages]);

    // Scroll to the bottom of the chat when messages change
    useEffect(() => {
        if (chatBoxContentRef.current) {
            chatBoxContentRef.current.scrollTop = chatBoxContentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleMessageChange = (e) => setMessage(e.target.value);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const tempMessage = { message, sender: 'user' };
        setMessages((prev) => [...prev, tempMessage]);
        setIsSending(true);

        try {
            const response = await fetch(`http://localhost:5000/message/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                console.error('Error sending message:', response.statusText);
                setMessages((prev) => prev.slice(0, -1)); // Remove the last (temp) message
            }

            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => prev.slice(0, -1)); // Remove the last (temp) message
        } finally {
            setIsSending(false);
        }

        socket.emit('newMsg', { message, conversationId });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSending) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Rendered messages using useMemo for optimization
    const renderedMessages = useMemo(() => {
        return messages.map((msg, index) => (
            <div
                key={index}
                className={`messageDiv ${msg.sender === 'user' ? 'senderMsg' : 'receiverMsg'}`}
            >
                <div className="messageStyleDiv">
                    <p className="message">{msg.message}</p>
                </div>
            </div>
        ));
    }, [messages]);

    return (
        <div className="ChatBox">
            {!messages.length && !userName && <p>Click on a user to chat</p>}
            {messages.length > 0 && userName && (
                <>
                    <div id="chatBoxHeader">
                        <h2>{userName}</h2>
                    </div>
                    <div id="chatBoxContent" ref={chatBoxContentRef}>
                        {renderedMessages}
                    </div>
                    <div id="newMsgDiv">
                        <input
                            type="text"
                            id="messageInput"
                            placeholder="Type a message..."
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyPress}
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
