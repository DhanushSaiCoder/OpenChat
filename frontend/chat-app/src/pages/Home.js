import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../styles/Home.css';
import Layout from '../components/Layout';
import ChatList from './../components/ChatList';
import ChatBox from './../components/ChatBox';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [messageData, setMessageData] = useState([]);
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Set initial state based on window width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Create a state to keep track of screen width

  // Check if the token is expired
  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      return expiry < now;
    } catch (e) {
      console.error('Invalid token', e);
      return true;
    }
  }

  // Check token and redirect if needed
  function checkTokenAndRedirect() {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      window.location.href = 'auth/login';
    } else {
      console.log('Token is valid');
    }
  }

  useEffect(() => {
    checkTokenAndRedirect();

    // Function to handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setScreenWidth(width); // Update screen width state
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [screenWidth]); // Add screenWidth to the dependency array

  const displayChatBox = (data, userName, userId, conversationId) => {
    setConversationId(conversationId);
    setMessageData(data);
    setUserName(userName);
    setUserId(userId);
  };

  return (
    <div className='container'>
      <div id='darker'>
        <div className='home'>
          <Layout />
          <div id="home-content">
            <ChatList displayChatBox={displayChatBox} />
            {!isMobile && (
              <ChatBox messageData={messageData} userName={username} userId={userId} conversationId={conversationId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


