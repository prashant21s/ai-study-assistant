import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api.js';

const CodeExplain = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'C', 'HTML/CSS', 'SQL', 'Other'];

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setExplanation('');

    try {
      const res = await api.post('/gemini/code-explain', { code: code.trim(), language });
      setExplanation(res.data.explanation);
    } catch (error) {
      console.error(error);
      setExplanation('Failed to explain code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>AI Code Explainer</h2>

        <form onSubmit={handleExplain} style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label>Programming Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Paste Your Code</label>
            <textarea
              rows="10"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Explaining...' : 'Explain Code'}
          </button>
        </form>
      </div>

      {explanation && (
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Explanation</h3>
          <div className="markdown-content">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExplain;
