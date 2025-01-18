import React, { Component } from 'react';

const Conversation = (props) => {

    const {userName , userId} = props
    return (
        <p>
            {userName} - {userId}
        </p>
    );
}

export default Conversation;