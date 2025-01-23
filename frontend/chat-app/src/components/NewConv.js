import React, { Component } from 'react';
import '../styles/NewConv.css'
const NewConv = () => {
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
                    
                </div>
                <div id='footer'>
                    <button id='doneBtn'>Done</button>
                </div>

            </div>
        </div>);
}

export default NewConv;