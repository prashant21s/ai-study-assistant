import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import geminiRoutes from './routes/gemini.js';
import historyRoutes from './routes/history.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../client/dist');

const app = express();

app.use(cors());
app.use(express.json());

app.locals.demoStore = {
  users: [],
  chats: [],
  notes: [],
};
app.locals.dbConnected = await connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/history', historyRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    message: 'AI Study Assistant API is running',
    database: app.locals.dbConnected ? 'mongodb' : 'in-memory demo',
    ai: process.env.GEMINI_API_KEY ? 'gemini' : 'mock demo',
  });
});

app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
