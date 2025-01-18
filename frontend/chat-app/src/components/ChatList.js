import React, { Component, useEffect, useState } from 'react';

import '../styles/ChatList.css'

const ChatList = () => {
    const baseURL = 'http://localhost:5000'
    const [userId, setUserId] = useState('')

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
                    setUserId(userId)
                })
                .catch((error) => {
                    console.error('Error fetching user ID:', error);
                });
        } else {
            console.log('No token found');
        }
    }, []);

    useEffect(() => {
        if (userId != '') {
            //get all the conversations that user is involved in...
            const token = localStorage.getItem('token');

            fetch(`${baseURL}/conversation`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                })
                .catch((error) => {
                    console.error('Error fetching user ID:', error);
                });
        }
    }, [userId])

    return (
        <div className='ChatList'>
            chat List
        </div>
    );
}

export default ChatList;