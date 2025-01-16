import React, { Component } from 'react';
import '../styles/Home.css'
import Layout from '../components/Layout';
import ChatList from './../components/ChatList';
const Home = () => {
    return (
        <div className='container'>
            <div id='darker'>
                <div className='home'>
                    <Layout />
                    <ChatList/>
                    
                    <h2>Hello</h2>
                </div>
            </div >
        </div>
    );
}

export default Home;