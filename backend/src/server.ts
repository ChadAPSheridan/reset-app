import { json } from 'body-parser';
import { connectToDatabase } from './config/database'; // Ensure this path is correct
import { app } from './app'; // Use named import
import Task from './models/taskModel'; // Import the Task model
import User from './models/userModel';
import Column from './models/columnModel';
import bcrypt from 'bcrypt';
import crypto from 'crypto'; // Import crypto module
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PORT = process.env.PORT || 3001;

// Middleware
app.use(json());

const generateSecurePassword = (length: number) => {
  return crypto.randomBytes(length).toString('hex');
};

const initializeDatabase = async () => {
  try {
    // Connect to the database and create it if it doesn't exist
    await connectToDatabase();

    // Synchronize models with the database
    await Column.sync();
    await User.sync();
    await Task.sync();

    console.log('Database and tables synchronized successfully.');

    // Check if admin user exists
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const adminPassword = generateSecurePassword(16); // Generate a secure password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        password: hashedPassword,
        permissionLevel: 'admin',
      });
      console.log('**************************************************');
      console.log('*                                                *');
      console.log(`*  Admin user created with password: ${adminPassword}  *`);
      console.log('*                                                *');
      console.log('**************************************************');
    } else {
      console.log('Admin user already exists.');
    }

    // Check if any columns exist
    const columns = await Column.findAll();
    if (columns.length === 0) {
      // Add default columns
      await Column.bulkCreate([
        { title: 'To Do', description: 'Tasks to be done', position: 1 },
        { title: 'In Process', description: 'Tasks in progress', position: 2 },
        { title: 'Review', description: 'Tasks to be reviewed', position: 3 },
        { title: 'Done', description: 'Completed tasks', position: 4 },
      ]);
      console.log('Default columns created: To Do, In Process, Done');
    } else {
      console.log('Columns already exist.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize the database and start the server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { username, password });
      localStorage.setItem('authUser', JSON.stringify(response.data.user)); // Store the user object
      localStorage.setItem('auth', response.data.token); // Store the token
      navigate('/');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesLoaded = async (container: any): Promise<void> => {
    // console.log(container);
  };

  return (
    <div className="login-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#45BDEE",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#fff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.7,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
        className="particles"
      />
      <div className="login-container">
        <img src="/logo.png" alt="Company Logo" className="logo-image" />
        <h1 className='app-name'>Reset</h1>
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