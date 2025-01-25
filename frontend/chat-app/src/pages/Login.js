import React, { useState } from 'react';
import '../styles/Login.css'; 
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const baseURL = process.env.BACKEND_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        localStorage.setItem('token', token);
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials or server error');
      }
    } catch (err) {
      setError('An error occurred while logging in');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
              className="input"
            />
          </div>
          <div className="inputGroup">
            <label className="label" htmlFor="password">Password</label>
            <div className="passwordWrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input passwordInput"
              />
              <button
                type="button"
                className="showHidePassword"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <p id='already'>Do not have an account?</p><Link to='/auth/signup'>Sign Up</Link>

          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
