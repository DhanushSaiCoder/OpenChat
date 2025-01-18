import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../styles/Home.css';
import Layout from '../components/Layout';
import ChatList from './../components/ChatList';
import ChatBox from './../components/ChatBox';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook


  useEffect(() => {
    // Check if token exists in localStorage
    if (!localStorage.getItem('token')) {
      navigate('/auth/login'); // Redirect to login page if no token
    }
  }, [navigate]);

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
      </div>
    </div>
  );
};

export default Home;
