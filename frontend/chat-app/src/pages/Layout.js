import { Outlet, Link } from "react-router-dom";
import '../styles/Layout.css'; // Import the CSS file

const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2 onClick={() => window.location.href='/'}>MyApp</h2>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">SignUp</Link></li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
