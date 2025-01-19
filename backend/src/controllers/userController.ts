import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, password, permissionLevel } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      permissionLevel,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, username, password, permissionLevel } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
    await user.update({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      permissionLevel,
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};