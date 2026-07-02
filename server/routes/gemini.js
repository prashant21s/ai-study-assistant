import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

const createDemoReply = (input, type = 'chat') => {
  if (type === 'notes') {
    return `# Study Notes: ${input}

## Key Concepts
- This demo response confirms the notes workflow is running.
- Add a real GEMINI_API_KEY in server/.env to receive live AI-generated notes.

## Summary
The frontend, authentication, backend routes, and history saving are connected.`;
  }

  if (type === 'code') {
    return `## Code Explanation

This is a demo explanation because GEMINI_API_KEY is not configured.

Your submitted code reached the backend successfully. Add a real Gemini API key in server/.env for full AI explanations.`;
  }

  return `Demo AI reply: I received "${input}". Add GEMINI_API_KEY in server/.env to enable live Gemini responses.`;
};

router.post('/chat', protect, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const model = getModel();
    if (!model) {
      return res.json({ reply: createDemoReply(message) });
    }

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return res.json({ reply: response.text() });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({ message: 'Failed to get AI response' });
  }
});

router.post('/study-notes', protect, async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const model = getModel();
    if (!model) {
      return res.json({ notes: createDemoReply(topic, 'notes') });
    }

    const prompt = `Generate detailed and easy-to-understand study notes on the topic: "${topic}".
Include:
- Key concepts
- Important definitions
- Examples if applicable
- Summary points
Format using markdown with headings and bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.json({ notes: response.text() });
  } catch (error) {
    console.error('Gemini Notes Error:', error);
    return res.status(500).json({ message: 'Failed to generate notes' });
  }
});

router.post('/code-explain', protect, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const model = getModel();
    if (!model) {
      return res.json({ explanation: createDemoReply(code, 'code') });
    }

    const prompt = `Explain the following ${language || ''} code in simple terms.
Also mention what it does, line-by-line if needed, and any improvements:

\`\`\`
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.json({ explanation: response.text() });
  } catch (error) {
    console.error('Gemini Code Explain Error:', error);
    return res.status(500).json({ message: 'Failed to explain code' });
  }
});

export default router;
