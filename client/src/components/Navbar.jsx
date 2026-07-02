import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold' }}>
          AI Study Assistant
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/chat">AI Chat</Link>
              <Link to="/notes">Study Notes</Link>
              <Link to="/code-explain">Code Explainer</Link>
              <Link to="/history">History</Link>
              <span style={{ marginLeft: '20px' }}>Hi, {user?.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
