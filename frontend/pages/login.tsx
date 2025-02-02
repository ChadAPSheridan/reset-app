import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ParticlesBackground from '../components/ParticlesBackground';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      
      console.log('response:', response.data);
      console.log('response.data.user:', response.data.user);
      // Store the user object
      localStorage.setItem('authUser', JSON.stringify(response.data.user));
      
      // Store the token
      localStorage.setItem('auth', response.data.token);
      router.push('/');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <ParticlesBackground />
      <div className="login-container">
        <img src="/Reset-Logo.svg" alt="Company Logo" className="logo-image" />
        <h1 className='app-name'><img src="Reset-Logo.svg" className='logo-in-text'/>eset</h1>
        <h3 className='app-description'>Task Management System</h3>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;