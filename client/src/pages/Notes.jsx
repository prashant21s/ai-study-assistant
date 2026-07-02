import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api.js';

const Notes = () => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const generateNotes = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setNotes('');

    try {
      const res = await api.post('/gemini/study-notes', { topic: topic.trim() });
      setNotes(res.data.notes);
    } catch (error) {
      console.error(error);
      setNotes('Failed to generate notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async () => {
    if (!notes || !topic.trim()) return;

    setSaving(true);
    try {
      await api.post('/history/notes', { topic: topic.trim(), content: notes });
      alert('Notes saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>AI Study Notes Generator</h2>

        <form onSubmit={generateNotes} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Enter Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. React Hooks, Machine Learning, DBMS"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Notes'}
          </button>
        </form>
      </div>

      {notes && (
        <div className="card">
          <div className="section-heading">
            <h3>Notes on: {topic}</h3>
            <button className="btn-secondary" onClick={saveNotes} disabled={saving}>
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
