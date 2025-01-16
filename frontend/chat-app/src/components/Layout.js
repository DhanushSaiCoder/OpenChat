import { Outlet, Link } from "react-router-dom";
import '../styles/Layout.css'; // Import the CSS file

const Layout = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2 ><Link className="appLogo" to="/">MyApp</Link></h2>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
