import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reusing login styles

export default function Register() {

    const navigate = useNavigate();

    const [username, setU] = useState('');
    const [email, setE] = useState('');
    const [password, setP] = useState('');
    const [msg, setMsg] = useState('');

    const handle = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/signup', {
                username, email, password
            });
            setMsg('Register success! Go login.');
            navigate('/login');
        } catch {
            setMsg('Register failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Register</h2>

                <div className="form-group">
                    <label>Username</label>
                    <div className="input-container">
                        <input
                            placeholder="John"
                            onChange={e => setU(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <div className="input-container">
                        <input
                            placeholder="john@example.com"
                            onChange={e => setE(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="..."
                            onChange={e => setP(e.target.value)}
                        />
                    </div>
                </div>

                <button className="login-button" onClick={handle}>
                    Register
                </button>

                {msg && <p style={{ textAlign: 'center', marginTop: '1rem', color: msg.includes('failed') ? 'red' : 'green' }}>{msg}</p>}

                <Link to="/login" className="register-link">
                    Already have an account? Login here
                </Link>
            </div>
        </div>
    );
}