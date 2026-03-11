import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import '../pages/Dashboard.css';

const Layout = ({ children, title = "Dashboard" }) => {
    const { user } = useSelector(s => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>{isAdmin ? "Admin Dashboard" : title}</h1>
                <div className="welcome-msg">
                    Welcome, {user?.username || 'User'}
                </div>
            </header>

            <nav className="dashboard-nav">
                <Link to="/" className="nav-item">Home</Link>
                {isAdmin ? (
                    <>
                        <Link to="/admin" className="nav-item">Manage Questions</Link>
                        <Link to="/admin" className="nav-item">Manage Articles</Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-item">Quiz</Link>
                        <Link to="/" className="nav-item">Article</Link>
                    </>
                )}
                <button
                    onClick={handleLogout}
                    className="nav-item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, fontSize: '0.95rem', color: '#666' }}
                >
                    Logout
                </button>
            </nav>

            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
