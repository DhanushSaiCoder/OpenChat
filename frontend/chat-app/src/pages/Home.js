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
  const [conversationId, setConversationId] = useState('')

  useEffect(() => {
    // Check if token exists in localStorage
    function isTokenExpired(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp;
        const now = Math.floor(Date.now() / 1000);

        if (expiry < now) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error('Invalid token', e);
        return true;
      }
    }

    function checkTokenAndRedirect() {
      const token = localStorage.getItem('token');

      if (!token || isTokenExpired(token)) {
        window.location.href = 'auth/login';
      } else {
        console.log('Token is valid');
        // Proceed with the rest of your app logic
      }
    }
    checkTokenAndRedirect()
  }, []);

  const displayChatBox = (data, userName, userId, conversationId) => {
    setConversationId(conversationId)
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
            <ChatBox messageData={messageData} userName={username} userId={userId} conversationId={conversationId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
