import React, { useState, useEffect } from 'react';
import * as api from '../api';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      if (isLogin) {
        await api.login(username, password);
        localStorage.setItem('user', username);
        onLogin(username);
      } else {
        await api.register(username, password);
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
      setUsername('');
      setPassword('');
      setFormErrors({});
    } catch (error) {
      alert(error.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setFormErrors({});
      setIsAnimating(false);
    }, 150);
  };

  useEffect(() => {
    setFormErrors({});
  }, [username, password]);

  return (
    <div className={`auth-form ${isAnimating ? 'form-switching' : ''}`}>
      <div className="auth-header">
        <h2>{isLogin ? '👋 Welcome Back' : '🚀 Join Us'}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to access your documents'
            : 'Create your account to get started'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        <div className="input-group">
          {/* Username Field */}
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={formErrors.username ? 'error' : ''}
            />
            {formErrors.username && (
              <span className="error-message">{formErrors.username}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={formErrors.password ? 'error' : ''}
            />
            {/* <button
              type="button"
              className={`password-toggle ${showPassword ? 'rotate' : ''}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️🗨️'}
            </button> */}
            {/* <button
  type="button"
  className={`password-toggle ${showPassword ? 'rotate' : ''}`}
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? '👁️' : '👁️‍🗨️'}
</button> */}

            {formErrors.password && (
              <span className="error-message">{formErrors.password}</span>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (
            <>
              <span className="loading-spinner"></span> Processing...
            </>
          ) : (
            <>
              <span className="button-icon">{isLogin ? '🔑' : '✨'}</span>
              {isLogin ? 'Sign In' : 'Create Account'}
            </>
          )}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          {isLogin ? 'New to our platform? ' : 'Already have an account? '}
          <button type="button" onClick={handleModeSwitch} className="switch-button">
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
