import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../styles/Home.css';
import Layout from '../components/Layout';
import ChatList from './../components/ChatList';
import ChatBox from './../components/ChatBox';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [messageData, setMessageData] = useState([])
  const [username, setUserName] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    // Check if token exists in localStorage
    if (!localStorage.getItem('token')) {
      navigate('/auth/login'); // Redirect to login page if no token
    }
  }, [navigate]);
  var conversationId;
  const displayChatBox = (data, userName,userId,conversationId) => {
    conversationId = conversationId;
    setMessageData(data)
    setUserName(userName)
    setUserId(userId)
  }


  return (
    <div className='container'>
      <div id='darker'>
        <div className='home'>
          <Layout />
          <div id="home-content">
            <ChatList displayChatBox={displayChatBox} />
            <ChatBox messageData={messageData} userName={username} userId={userId} conversationId={conversationId}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
