import React, { useEffect, useState } from 'react';
import '../styles/NewConv.css';
import SyncLoader from 'react-spinners/SyncLoader';
import defaultProfile from '../profiles/defaultProfile.jpg';
import Fuse from 'fuse.js';

const NewConv = () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL

    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [search, setSearch] = useState('');

    const [userId, setUserId] = useState('');
    const [loadingFriends, setLoadingFriends] = useState(true); // Loader for initial loading
    const [loading, setLoading] = useState({}); // Loader for adding friends

    const token = localStorage.getItem('token');

    // Get logged in user id
    useEffect(() => {
        fetch(`${baseUrl}/auth/`, {
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
        fetch(`${baseUrl}/users/`, {
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
                const frnds = data.map(e => ({
                    username: e.username,
                    email: e.email,
                    userId: e._id,
                }));
                setFriends(frnds);
                setLoadingFriends(false); // Stop loader once friends are loaded
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setLoadingFriends(false); // Stop loader on error
            });
    }, [token]);

    const postConversation = (id) => {
        setLoading(prevState => ({ ...prevState, [id]: true }));

        fetch(`${baseUrl}/conversation/${id}`, {
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
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error posting conversation:', error);
            })
            .finally(() => {
                setLoading(prevState => ({ ...prevState, [id]: false }));
            });
    };

    const handleSearchChange = (e) => {
        const searchTxt = e.target.value.trim().toLowerCase();
        setSearch(searchTxt);
    };

    useEffect(() => {
        if (!search.length) {
            setFilteredFriends([]);
            return;
        }

        const fuse = new Fuse(friends, {
            keys: ['username'],
            threshold: 0.3 // Adjust this to make the search more or less fuzzy
        });

        const result = fuse.search(search);
        const filtered = result.map((r) => r.item);

        setFilteredFriends(filtered);
    }, [search, friends]);

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
                        <input onChange={handleSearchChange} id="newConvSearchInp" type='search' placeholder='Search by username...' />
                    </div>
                    {loadingFriends ? (
                        <div className='loaderContainer'>
                            <SyncLoader color={"#fff"} size={10} />
                        </div>
                    ) : !search.length && friends.length > 0 ? (
                        friends.map((user) => (
                            <div className='conversation' key={user.userId}>
                                <img className='newConvProfilePic' src={defaultProfile} alt="profile" />
                                <div className='userDetailsDiv'>
                                    <h4 className='newConvUserName'>{user.username}</h4>
                                </div>
                                <div
                                    onClick={!loading[user.userId] ? () => { postConversation(user.userId) } : null}
                                    className={`addFriendDiv ${loading[user.userId] ? 'loading' : ''}`}
                                >
                                    <b>{loading[user.userId] ? 'Adding...' : 'Add'}</b>
                                </div>
                            </div>
                        ))
                    ) : null}

                    {search.length && filteredFriends.length > 0 ? (
                        filteredFriends.map((user) => (
                            <div className='conversation' key={user.userId}>
                                <img className='newConvProfilePic' src={defaultProfile} alt="profile" />
                                <div className='userDetailsDiv'>
                                    <h4 className='newConvUserName'>{user.username}</h4>
                                </div>
                                <div
                                    onClick={!loading[user.userId] ? () => { postConversation(user.userId) } : null}
                                    className={`addFriendDiv ${loading[user.userId] ? 'loading' : ''}`}
                                >
                                    <b>{loading[user.userId] ? 'Adding...' : 'Add'}</b>
                                </div>
                            </div>
                        ))
                    ) : null}

                    {!friends.length && !loadingFriends && (
                        <p className='usersOver'>You are a friend of all users.<br />Waiting for a new user to sign up</p>
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
