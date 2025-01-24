import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import '../styles/Layout.css'; // Import the CSS file

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDoc, setUserDoc] = useState({});
  const navigate = useNavigate(); // useNavigate hook for redirection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Set initial state based on window width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Create a state to keep track of screen width


  useEffect(() => {
    // checkTokenAndRedirect();

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


  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      // For example, check token validity (this can be done differently based on your app)
      const isValid = validateToken(token); // A placeholder for token validation logic
      setIsAuthenticated(isValid);
    }

    fetch('/auth/userFullDoc', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('userDoc : ', data)
        setUserDoc(data);
      })
      .catch((error) => {
        console.error('Error fetching user ID:', error);
      });
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
    navigate("/auth/login"); // Use navigate hook to redirect
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2 ><Link id="title" className="appLogo" to="/">Open Chat</Link></h2>
        </div>
        <ul className="navbar-links">
          {/* Conditional rendering based on authentication status */}
          {!isAuthenticated ? (
            <>
              <li><Link to="/auth/signup">Sign Up</Link></li>
              <li><Link to="/auth/login">Log In</Link></li>
            </>
          ) : (
            <>
              <div className="headerUserDetailsDiv"><h3>{userDoc.username}</h3><p>{userDoc.email}</p></div>
              <li><button onClick={handleLogout} className="logout-button">Log Out</button></li> {/* Logout button */}
            </>
          )}
        </ul>
        {isMobile && (
          <i id="menuIcon" class="fa-solid fa-bars"></i>
        )}
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
