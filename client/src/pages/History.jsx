import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api.js';

const History = () => {
  const [chats, setChats] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchHistory = async () => {
    try {
      const [chatsRes, notesRes] = await Promise.all([
        api.get('/history/chats'),
        api.get('/history/notes'),
      ]);
      setChats(chatsRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteChat = async (id) => {
    if (!window.confirm('Delete this chat?')) return;
    try {
      await api.delete(`/history/chats/${id}`);
      setChats((items) => items.filter((chat) => chat._id !== id));
      setSelectedChat(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/history/notes/${id}`);
      setNotes((items) => items.filter((note) => note._id !== id));
      setSelectedNote(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Your History</h2>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Saved Chats</h3>

        {chats.length === 0 ? (
          <p style={{ color: '#888' }}>No saved chats yet.</p>
        ) : (
          <div className="history-list">
            {chats.map((chat) => (
              <div className="history-item" key={chat._id}>
                <div>
                  <h4>{chat.title}</h4>
                  <small>{new Date(chat.createdAt).toLocaleString()}</small>
                </div>
                <div className="history-actions">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSelectedChat(chat);
                      setSelectedNote(null);
                    }}
                  >
                    View
                  </button>
                  <button className="btn-danger" onClick={() => deleteChat(chat._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedChat && (
          <div className="history-detail">
            <h4>{selectedChat.title}</h4>
            {selectedChat.messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`chat-message ${msg.role}`}>
                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                <ReactMarkdown className="markdown-content">{msg.text}</ReactMarkdown>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Saved Notes</h3>

        {notes.length === 0 ? (
          <p style={{ color: '#888' }}>No saved notes yet.</p>
        ) : (
          <div className="history-list">
            {notes.map((note) => (
              <div className="history-item" key={note._id}>
                <div>
                  <h4>{note.topic}</h4>
                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                </div>
                <div className="history-actions">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSelectedNote(note);
                      setSelectedChat(null);
                    }}
                  >
                    View
                  </button>
                  <button className="btn-danger" onClick={() => deleteNote(note._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedNote && (
          <div className="history-detail">
            <h4>{selectedNote.topic}</h4>
            <div className="markdown-content">
              <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
