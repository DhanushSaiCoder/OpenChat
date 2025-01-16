import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  const baseUrl = 'http://localhost:5000'
  const [data, setData] = useState('');

  useEffect(() => {
    fetch(`${baseUrl}/`, {
      method: 'GET',
    })
      .then((response) => response.text()) // Assuming the response is plain text
      .then((data) => setData(data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
