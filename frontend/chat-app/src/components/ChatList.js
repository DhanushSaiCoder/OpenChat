import React, { useEffect, useState } from 'react';
import '../styles/ChatList.css';
import Conversation from './Conversation';

const ChatList = () => {
    const baseURL = 'http://localhost:5000';
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);  // users should be an array

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
                                userId: element.participants[1]._id
                            });
                        } else {
                            userList.push({
                                userName: element.participants[0].username,
                                userId: element.participants[0]._id
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

    if (users.length) console.log('users:    ', users);

    return (
        <div className='ChatList'>
            <div id='header'>
                <h2>Users</h2>
                <input id="searchInp" type='search' placeholder='Search...' />
            </div>
            <div id='content'>
                {users.map((user) => (
                    <Conversation key={user.userId} userName={user.userName} userId={user.userId} />
                ))}
            </div>
        </div>
    );
};

export default ChatList;
