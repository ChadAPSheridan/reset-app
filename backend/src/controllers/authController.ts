import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const SECRET_KEY = 'your_secret_key'; // Use a secure key in production

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // console.log('Login attempt:', { username, password }); // Log the login attempt
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found'); // Log if user is not found
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password'); // Log if password is invalid
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        permissionLevel: user.permissionLevel,
      },
    });
  } catch (error) {
    console.error('Login error:', error); // Log any errors
    res.status(500).json({ message: (error as Error).message });
  }
};