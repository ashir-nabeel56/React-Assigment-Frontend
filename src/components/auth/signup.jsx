import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = "https://final-delta-ivory.vercel.app/auth/signup";

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
        // 1. Auth data save karein
        localStorage.setItem('isLoggedIn', 'true');
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

        // 2. Global state notification dispatch karein
        window.dispatchEvent(new Event('authChanged'));

        // 3. Directly navigate to /first
        navigate('/first');
      } else {
        setMessage({ type: 'error', text: data.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage({ type: 'error', text: 'Server connection failed. Please try later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>

        {message.text && (
          <div className={`alert-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;