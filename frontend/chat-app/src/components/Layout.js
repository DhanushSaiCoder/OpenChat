import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import '../styles/Layout.css'; // Import the CSS file

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    
    if (token) {
      // For example, check token validity (this can be done differently based on your app)
      const isValid = validateToken(token); // A placeholder for token validation logic
      setIsAuthenticated(isValid);
    }
  }, []);

  // Token validation logic (this can be adjusted based on your needs)
  const validateToken = (token) => {
    try {
      // If the token is a JWT, you can decode and check its expiration
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT (if applicable)
      return decoded.exp > Date.now() / 1000; // Check if token is expired
    } catch (e) {
      return false; // If decoding fails or invalid token, return false
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsAuthenticated(false);
    window.location.href="/auth/login" // Update authentication state
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2><Link className="appLogo" to="/">Chat Now</Link></h2>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>

          {/* Conditional rendering based on authentication status */}
          {!isAuthenticated ? (
            <>
              <li><Link to="/auth/signup">Sign Up</Link></li>
              <li><Link to="/auth/login">Log In</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/profile">Profile</Link></li>  {/* Example profile link for authenticated users */}
              <li><button onClick={handleLogout} className="logout-button">Log Out</button></li> {/* Logout button */}
            </>
          )}
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
