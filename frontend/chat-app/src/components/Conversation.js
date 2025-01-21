import React from 'react';
import '../styles/Conversation.css'
import defaultProfile from '../profiles/defaultProfile.jpg';


const Conversation = (props) => {

    const {userName , userId , lastMessage} = props
    return (
        <div className='conversation'>
            <img className='profilePic' src={defaultProfile} alt="profile" />
            <div className='userDetailsDiv'>
                <h4>{userName}</h4>
                <p className='lastMessage'>{lastMessage}</p>
            </div>
        </div>
    );
}

export default Conversation;