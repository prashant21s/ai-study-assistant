import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'AI Chat',
      desc: 'Ask anything and get instant study help.',
      link: '/chat',
      btn: 'Start Chat',
    },
    {
      title: 'Study Notes',
      desc: 'Generate complete study notes on any topic.',
      link: '/notes',
      btn: 'Generate Notes',
    },
    {
      title: 'Code Explainer',
      desc: 'Paste code and get a simple explanation.',
      link: '/code-explain',
      btn: 'Explain Code',
    },
    {
      title: 'History',
      desc: 'View your saved chats and generated notes.',
      link: '/history',
      btn: 'View History',
    },
  ];

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Welcome, {user?.name}!</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Your personal AI study assistant is ready to help you learn faster.
        </p>
      </div>

      <div className="dashboard-grid">
        {features.map((feature) => (
          <div className="feature-card" key={feature.link}>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <Link to={feature.link}>
              <button className="btn-primary">{feature.btn}</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
