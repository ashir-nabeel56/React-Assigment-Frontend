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

  const API_BASE = "https://final-delta-ivory.vercel.app";
  const SIGNUP_URL = `${API_BASE}/auth/signup`;
  const LOGIN_URL = `${API_BASE}/auth/login`;

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
      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Signup response:', data); // debug ke liye - baad mein hata sakte hain

      if (!response.ok) {
        setMessage({ type: 'error', text: data.message || 'Signup failed. Please try again.' });
        setLoading(false);
        return;
      }

      // Agar signup response mein token pehle se aa gaya
      let token = data.token;
      let user = data.user;

      // Agar token nahi mila, to turant login karke token le lein
      if (!token) {
        const loginResponse = await fetch(LOGIN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginResponse.json();
        console.log('Auto-login response:', loginData); // debug ke liye

        if (loginResponse.ok && loginData.token) {
          token = loginData.token;
          user = loginData.user || user;
        } else {
          // Signup ho gaya lekin auto-login fail hua -
          // user ko login page bhej dein
          setMessage({
            type: 'error',
            text: 'Account ban gaya hai, lekin auto-login fail hua. Please login manually.',
          });
          setLoading(false);
          navigate('/login');
          return;
        }
      }

      // Ab token guaranteed hai (ya to signup se, ya login se)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));

      // Global state notification dispatch karein
      window.dispatchEvent(new Event('authChanged'));

      // Directly navigate to /first
      navigate('/first');
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