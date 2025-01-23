import React, { useEffect, useState } from 'react';
import '../styles/NewConv.css';
import defaultProfile from '../profiles/defaultProfile.jpg';

const NewConv = () => {
    const [friends, setFriends] = useState([]);
    const [userId, setUserId] = useState('');
    const [reload, setReload] = useState(true)
    const token = localStorage.getItem('token');

    // Get logged in user id
    useEffect(() => {
        fetch(`http://localhost:5000/auth/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setUserId(data);
            })
            .catch((error) => {
                console.error('Error fetching user ID:', error);
            });
    }, [token]);

    // Get all the users by GET /users
    useEffect(() => {
        fetch(`http://localhost:5000/users/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('raw friends: ', data);
                const frnds = data.map(e => ({
                    username: e.username,
                    email: e.email,
                    userId: e._id,
                }));
                console.log('friends', frnds);
                setFriends(frnds);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, [token]);

    const postConversation = (id) => {
        fetch(`http://localhost:5000/conversation/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "participants": [id, userId]
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                window.location.reload()
            })
            .catch((error) => {
                console.error('Error posting conversation:', error);
            });
    }

    return (
        <div className='newConvContainer'>
            <div id='newConv'>
                <div id='newConvHeader'>
                    <div id='headingDiv'>
                        <h2>Add Users</h2>
                    </div>
                </div>
                <div id='content'>
                    <div id='searchDiv'>
                        <input id="newConvSearchInp" type='search' placeholder='Search by username...' />
                    </div>
                    {friends.length > 0 && (
                        friends.map((user) => (
                            <div className='conversation' key={user.userId}>
                                <img className='profilePic' src={defaultProfile} alt="profile" />
                                <div className='userDetailsDiv'>
                                    <h4>{user.username}</h4>
                                    <p className='mails'>{user.email}</p>
                                </div>
                                <div onClick={() => { postConversation(user.userId) }} className='addFriendDiv'><b>Add</b></div>
                            </div>
                        ))
                    )}
                    {!friends.length && (
                        <p class='usersOver'>You are a friend of all users.<br />Waiting for a new user to sign up</p>

                    )}
                </div>
                <div id='footer'>
                    <button onClick={() => {
                        window.location.href = '/'
                    }} id='doneBtn'>Done</button>
                </div>
            </div>
        </div>
    );
}

export default NewConv;
