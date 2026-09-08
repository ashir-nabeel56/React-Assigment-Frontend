import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = "https://final-delta-ivory.vercel.app/auth/login";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Login successful!' });
        localStorage.setItem('isLoggedIn', 'true');
        window.dispatchEvent(new Event('authChanged'));

        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          navigate('/first'); // Next component path
        }, 1500);

      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid email or password.' });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: 'error', text: 'Server connection failed. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Log In to Your Account</h2>

        {message.text && (
          <div className={`alert-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default Login;