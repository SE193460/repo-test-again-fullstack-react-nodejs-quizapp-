import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {

    const dispatch = useDispatch();

    const [email, setE] = useState('');
    const [password, setP] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await dispatch(login({ email, password })).unwrap();
            navigate('/');
        } catch (e) {
            console.error('Login failed', e);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>

                <div className="form-group">
                    <label>Username</label>
                    <div className="input-container">
                        <input
                            placeholder="John"
                            onChange={e => setE(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="input-container">
                        <input
                            placeholder="..."
                            type={showPassword ? "text" : "password"}
                            onChange={e => setP(e.target.value)}
                        />
                        <span className="password-toggle" onClick={togglePasswordVisibility}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {showPassword ? (
                                    <>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </>
                                ) : (
                                    <>
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </>
                                )}
                            </svg>
                        </span>
                    </div>
                </div>

                <button className="login-button" onClick={handleLogin}>
                    Login
                </button>

                <Link to="/register" className="register-link">
                    Don't have an account? Register here
                </Link>
            </div>
        </div>
    );
}