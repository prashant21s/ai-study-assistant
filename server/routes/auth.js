import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const isMongoConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev_only_change_me', {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (!isMongoConnected()) {
      const users = req.app.locals.demoStore.users;
      const normalizedEmail = email.toLowerCase().trim();
      const userExists = users.find((user) => user.email === normalizedEmail);

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = {
        _id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        createdAt: new Date().toISOString(),
      };
      users.push(user);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (!isMongoConnected()) {
      const normalizedEmail = email.toLowerCase().trim();
      const user = req.app.locals.demoStore.users.find((item) => item.email === normalizedEmail);

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      }

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', protect, async (req, res) => {
  return res.json(req.user);
});

export default router;
