import React, { Component } from 'react';
import '../styles/Home.css'
import Layout from '../components/Layout';
import ChatList from './../components/ChatList';
import ChatBox from './../components/ChatBox';
const Home = () => {
    return (
        <div className='container'>
            <div id='darker'>
                <div className='home'>
                    <Layout />
                    <div id="home-content">
                        <ChatList />
                        <ChatBox />
                    </div>
                </div>
            </div >
        </div>
    );
}

export default Home;