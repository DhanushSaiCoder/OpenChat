import React, { useState } from 'react';
import '../styles/Login.css';  // Import the CSS file

const Login = () => {
  // State to hold input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }

    // Proceed with login logic
    console.log('Logging in with:', { email, password });
    setError(''); // Clear error if validation passes

    // Simulate successful login (replace with real authentication logic)
    alert('Login Successful!');
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="heading">Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="inputGroup">
            <label className="label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="input"
            />
          </div>
          <button type="submit" className="button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
