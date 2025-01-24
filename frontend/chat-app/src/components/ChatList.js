import React, { useEffect, useState } from 'react';
import '../styles/ChatList.css';
import Conversation from './Conversation';
import Fuse from 'fuse.js';

const ChatList = ({ displayChatBox, togglePage }) => {
    const baseURL = 'http://localhost:5000';
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');

    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${baseURL}/auth`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    const userId = data.userId;
                    setUserId(userId);
                })
                .catch((error) => {
                    console.error('Error fetching user ID:', error);
                });
        } else {
            console.log('No token found');
        }
    }, []);

    useEffect(() => {
        if (userId !== '') {
            const token = localStorage.getItem('token');
            fetch(`${baseURL}/conversation`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    let userList = [];
                    data.forEach(element => {
                        if (element.participants[0]._id === userId) {
                            userList.push({
                                userName: element.participants[1].username,
                                userId: element.participants[1]._id,
                                lastMessage: element.lastMessage.content
                            });
                        } else {
                            userList.push({
                                userName: element.participants[0].username,
                                userId: element.participants[0]._id,
                                lastMessage: element.lastMessage.content
                            });
                        }
                    });
                    setUsers(userList);
                })
                .catch((error) => {
                    console.error('Error fetching conversations:', error);
                });
        }
    }, [userId]);

    const handleDisplayMessages = (data, userName, userId, conversationId) => {
        displayChatBox(data, userName, userId, conversationId);
        setSelectedUserId(userId);
    };

    const handleSearchChange = (e) => {
        const searchTxt = e.target.value.trim().toLowerCase();
        setSearch(searchTxt);
    };

    useEffect(() => {
        if (!search.length) return;

        const fuse = new Fuse(users, {
            keys: ['userName'],
            threshold: 0.3
        });

        const result = fuse.search(search);
        const filtered = result.map((r) => r.item);

        setFilteredUsers(filtered);
    }, [search, users]);

    return (
        <div className='ChatList'>
            <div id='header'>
                <h2>Friends</h2>
                <div onClick={() => {
                    window.location.href = '/addConversation'
                }} id='iconDiv'>
                    <i className="fa-solid fa-user-group"> +</i>
                </div>
                <input onChange={handleSearchChange} id="searchInp" type='search' placeholder='Search...' />
            </div>
            <div id='chatListContent'>
                {search.length ? (
                    filteredUsers.map((user) => (
                        <Conversation
                            togglePage={togglePage}
                            displayMessages={handleDisplayMessages}
                            key={user.userId}
                            userName={user.userName}
                            userId={user.userId}
                            lastMessage={user.lastMessage}
                            isSelected={selectedUserId === user.userId}
                        />
                    ))
                ) : (
                    users.map((user) => (
                        <Conversation
                            togglePage={togglePage}
                            displayMessages={handleDisplayMessages}
                            key={user.userId}
                            userName={user.userName}
                            userId={user.userId}
                            lastMessage={user.lastMessage}
                            isSelected={selectedUserId === user.userId}
                        />
                    ))
                )}
                <p
                    onClick={() => {
                        window.location.href = '/addConversation'
                    }}
                    className='addConv'
                >
                    + Add Friend
                </p>
            </div>
        </div>
    );
};

export default ChatList;
