import React, { useEffect, useState } from 'react';
import '../styles/NewConv.css';
import defaultProfile from '../profiles/defaultProfile.jpg';

const NewConv = () => {
    const [friends, setFriends] = useState([]);
    const token = localStorage.getItem('token');

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
                            </div>
                        ))
                    )}
                </div>
                <div id='footer'>
                    <button id='doneBtn'>Done</button>
                </div>
            </div>
        </div>
    );
}

export default NewConv;
