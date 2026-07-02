import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api.js';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const outgoingText = input.trim();
    const userMessage = { role: 'user', text: outgoingText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const res = await api.post('/gemini/chat', {
        message: outgoingText,
        history,
      });

      const aiMessage = { role: 'model', text: res.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveChat = async () => {
    if (messages.length === 0) return;

    setSaving(true);
    try {
      const title = messages[0].text.length > 50 ? `${messages[0].text.slice(0, 50)}...` : messages[0].text;
      await api.post('/history/chats', { title, messages });
      alert('Chat saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save chat');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>AI Chat</h2>
          <button className="btn-secondary" onClick={saveChat} disabled={saving || messages.length === 0}>
            {saving ? 'Saving...' : 'Save Chat'}
          </button>
        </div>

        <div className="chat-window">
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>
              Start a conversation with the study assistant.
            </p>
          )}

          {messages.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className={`chat-message ${msg.role}`}>
              <ReactMarkdown className="markdown-content">{msg.text}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="chat-message model">
              <em>Thinking...</em>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
