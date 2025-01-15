import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Layout from './pages/Layout';

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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
