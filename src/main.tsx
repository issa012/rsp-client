import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './auth-context.tsx';
import Leaderboards from './leaderboards.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
    <Leaderboards />
  </AuthProvider>
);
