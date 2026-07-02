import express from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat.js';
import Note from '../models/Note.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

router.post('/chats', protect, async (req, res) => {
  try {
    const { title, messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages are required' });
    }

    if (!isMongoConnected()) {
      const chat = {
        _id: crypto.randomUUID(),
        user: req.user._id,
        title: title || 'Untitled Chat',
        messages,
        createdAt: new Date().toISOString(),
      };
      req.app.locals.demoStore.chats.push(chat);
      return res.status(201).json(chat);
    }

    const chat = await Chat.create({
      user: req.user._id,
      title: title || 'Untitled Chat',
      messages,
    });

    return res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to save chat' });
  }
});

router.get('/chats', protect, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const chats = req.app.locals.demoStore.chats
        .filter((chat) => chat.user === req.user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(chats);
    }

    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(chats);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch chats' });
  }
});

router.get('/chats/:id', protect, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const chat = req.app.locals.demoStore.chats.find(
        (item) => item._id === req.params.id && item.user === req.user._id
      );

      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      return res.json(chat);
    }

    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.json(chat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch chat' });
  }
});

router.delete('/chats/:id', protect, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const chats = req.app.locals.demoStore.chats;
      const chatIndex = chats.findIndex(
        (item) => item._id === req.params.id && item.user === req.user._id
      );

      if (chatIndex === -1) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      chats.splice(chatIndex, 1);
      return res.json({ message: 'Chat deleted' });
    }

    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    return res.json({ message: 'Chat deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete chat' });
  }
});

router.post('/notes', protect, async (req, res) => {
  try {
    const { topic, content } = req.body;

    if (!topic || !content) {
      return res.status(400).json({ message: 'Topic and content are required' });
    }

    if (!isMongoConnected()) {
      const note = {
        _id: crypto.randomUUID(),
        user: req.user._id,
        topic,
        content,
        createdAt: new Date().toISOString(),
      };
      req.app.locals.demoStore.notes.push(note);
      return res.status(201).json(note);
    }

    const note = await Note.create({
      user: req.user._id,
      topic,
      content,
    });

    return res.status(201).json(note);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to save note' });
  }
});

router.get('/notes', protect, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const notes = req.app.locals.demoStore.notes
        .filter((note) => note.user === req.user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(notes);
    }

    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

router.delete('/notes/:id', protect, async (req, res) => {
  try {
    if (!isMongoConnected()) {
      const notes = req.app.locals.demoStore.notes;
      const noteIndex = notes.findIndex(
        (item) => item._id === req.params.id && item.user === req.user._id
      );

      if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }

      notes.splice(noteIndex, 1);
      return res.json({ message: 'Note deleted' });
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete note' });
  }
});

export default router;
