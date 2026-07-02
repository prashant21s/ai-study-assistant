# 🤖 AI Study Assistant

A full-stack AI-powered study assistant built with **React**, **Node.js**, **JWT Authentication**, and **Google Gemini AI**. Perfect for your B.Tech final-year resume project.

> ✅ **No TypeScript** — Plain JavaScript throughout  
> ✅ **Clean, beginner-friendly code** with comments  
> ✅ **Production-ready structure** with authentication & history

---

## 🚀 Live Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Auth** | Register/Login with secure JSON Web Tokens |
| 💬 **AI Chat** | Ask anything to Gemini AI with full conversation history |
| 📝 **Study Notes Generator** | Enter any topic and get detailed AI-generated notes |
| 💻 **Code Explainer** | Paste code and get simple explanations |
| 📚 **Save History** | Save chats & notes to MongoDB and view them later |
| 🎨 **Clean UI** | Responsive React interface with markdown rendering |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + Vite + React Router + Axios |
| **Backend** | Node.js + Express.js |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Database** | MongoDB + Mongoose |
| **Styling** | Plain CSS |

---

## 📁 Project Structure

```
ai-study-assistant/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── CodeExplain.jsx
│   │   │   └── History.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env.example
│
├── server/                 # Node.js Backend
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── gemini.js
│   │   └── history.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## ✅ Prerequisites

Before starting, make sure you have installed:

1. **Node.js** (v18 or higher) → [Download here](https://nodejs.org/)
2. **MongoDB** → Either:
   - Install locally: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (free cloud database): [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
3. **Google Gemini API Key** → Get free from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🔧 Step-by-Step Setup

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you will paste it in `.env`

---

### Step 2: Setup MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service
3. Default connection URL: `mongodb://127.0.0.1:27017/aistudyassistant`

#### Option B: MongoDB Atlas (Recommended for resume/deploy)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user and allow access from anywhere (`0.0.0.0/0`)
4. Get connection string and replace `<password>` with your user password

---

### Step 3: Install Backend Dependencies

Open terminal in the project root, then run:

```bash
cd server
npm install
```

This installs: Express, Mongoose, JWT, bcryptjs, CORS, dotenv, and Gemini SDK.

---

### Step 4: Configure Backend Environment Variables

1. In the `server` folder, create a file named `.env`
2. Paste the following (replace with your actual values):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/aistudyassistant
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> **For MongoDB Atlas**, use:
> ```env
> MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aistudyassistant
> ```

---

### Step 5: Start the Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: 127.0.0.1
```

Test it: Open browser → `http://localhost:5000/`

---

### Step 6: Install Frontend Dependencies

Open a new terminal tab/window:

```bash
cd client
npm install
```

This installs: React, Vite, React Router, Axios, React Markdown.

---

### Step 7: Configure Frontend Environment Variables

1. In the `client` folder, create a file named `.env`
2. Paste:

```env
VITE_API_URL=http://localhost:5000/api
```

> In production, change this to your deployed backend URL.

---

### Step 8: Start the Frontend

```bash
npm run dev
```

Open the URL shown (usually `http://localhost:5173/`)

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user info |

### Gemini AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/gemini/chat` | Chat with Gemini |
| POST | `/api/gemini/study-notes` | Generate study notes |
| POST | `/api/gemini/code-explain` | Explain code |

### History

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/history/chats` | Save chat |
| GET | `/api/history/chats` | Get all saved chats |
| DELETE | `/api/history/chats/:id` | Delete a chat |
| POST | `/api/history/notes` | Save note |
| GET | `/api/history/notes` | Get all saved notes |
| DELETE | `/api/history/notes/:id` | Delete a note |

---

## 🧠 How It Works

### Authentication Flow (JWT)

1. User registers/logs in
2. Server validates and returns a **JWT token**
3. Token is saved in browser `localStorage`
4. Axios automatically attaches token to every request
5. `protect` middleware in backend verifies the token
6. If valid, user can access private routes

### Gemini AI Flow

1. User sends a message/topic/code from React
2. Frontend calls backend API with JWT token
3. Backend sends the prompt to Google Gemini API
4. Gemini returns AI-generated response
5. Backend sends it back to frontend
6. Frontend displays it with markdown formatting

---

## 📝 How to Use the App

1. **Register** a new account
2. **Login** with your credentials
3. From **Dashboard**, choose:
   - 💬 AI Chat — ask doubts, coding questions, anything
   - 📝 Study Notes — enter a topic like "React Hooks" or "DBMS"
   - 💻 Code Explainer — paste code and understand it
   - 📚 History — view and manage saved items

---

## 🚀 Deployment Guide

### Deploy Backend (Render / Railway / Heroku)

1. Push code to GitHub
2. Create a new web service on [Render](https://render.com/) or [Railway](https://railway.app/)
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
4. Set start command: `node server.js`

### Deploy Frontend (Vercel / Netlify)

1. Connect your GitHub repo to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable:
   ```env
   VITE_API_URL=https://your-backend-url.com/api
   ```

---

## 💼 Resume Points You Can Add

> **AI Study Assistant** — Full-Stack Web Application
> - Built a full-stack AI application using React, Node.js, Express, JWT, and Google Gemini API
> - Implemented secure user authentication with JWT tokens and password hashing using bcryptjs
> - Integrated Google Gemini API to provide AI chat, study notes generation, and code explanation features
> - Designed RESTful APIs for authentication, AI prompts, and user history management
> - Stored user data, chats, and notes in MongoDB using Mongoose ODM
> - Created a responsive React frontend with React Router and Context API for state management
> - Applied protected routes and middleware to secure private API endpoints

---

## 🐛 Common Errors & Fixes

### 1. `MongooseServerSelectionError`
- MongoDB is not running. Start MongoDB service or check your `MONGO_URI`.

### 2. `Invalid API Key` from Gemini
- Check your `.env` file. Make sure `GEMINI_API_KEY` has the correct key.

### 3. CORS error in browser
- Make sure backend has `app.use(cors())` and frontend `VITE_API_URL` points to correct backend port.

### 4. `Cannot find module '@vitejs/plugin-react'`
- Run `npm install` again in the `client` folder.

### 5. Login fails silently
- Check browser console and backend terminal for exact error messages.

---

## 📌 What You Learn From This Project

- How JWT authentication works in MERN-like apps
- How to protect routes in React and Express
- How to integrate Google Gemini AI API
- How to build REST APIs with Express and MongoDB
- How to manage global state with React Context API
- How to render markdown content in React
- How to structure a full-stack project for resume

---

## 🎯 Next Features You Can Add

- [ ] Forgot password / reset password via email
- [ ] Dark mode toggle
- [ ] Export notes as PDF
- [ ] Voice input using Web Speech API
- [ ] Quiz generator using Gemini
- [ ] Image/PDF upload and ask questions
- [ ] Real-time chat using Socket.io

---

## 📜 License

This project is free to use for learning and resume purposes.

---

## 👨‍💻 Author

Built for B.Tech final-year students to add a strong full-stack + AI project to their resume.

---

**Happy Coding! 🚀**
