import React, { useState } from 'react';
import '../styles/SignUp.css';  // Import the CSS file
import { Link } from 'react-router-dom';

const SignUp = () => {
  // State to hold input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Proceed with signup logic
    console.log('Signing up with:', { email, password });
    setError(''); // Clear error if validation passes

    // Simulate successful signup (replace with real authentication logic)
    alert('Signup Successful!');
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="heading">Sign Up</h2>
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
          <div className="inputGroup">
            <label className="label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="input"
            />
          </div>
          <p id='already'>Already have an account?</p><Link to='/auth/login'>Log in</Link>
          

          <button type="submit" className="button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
