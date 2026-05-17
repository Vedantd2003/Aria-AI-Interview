import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// StrictMode removed: it mounts every component twice in dev, causing
// double /auth/me calls which triggers rate limits and confuses the
// refresh-token interceptor.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
