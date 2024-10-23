import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { isAuthenticated } from './utils/authUtils';
import { getTheme } from './utils/themeUtils';
import PreLoader from './components/PreLoader';
import DelayedSuspense from './components/DelayedSuspense';
import AlertsList from './components/AlertList';

const AuthPage = React.lazy(() => import('./controllers/authPage'));
const PanelPage = React.lazy(() => import('./controllers/panelPage'));

function App() {
  const applyTheme = useCallback((theme: string) => {
    document.documentElement.classList.remove('dark', 'light', 'theme');

    if (theme === 'dark') {
      document.documentElement.classList.add('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.add('theme', 'light');
    } else {
      applySystemTheme();
    }
  }, []);

  const applySystemTheme = () => {
    if (!document.documentElement.classList.contains('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  useEffect(() => {
    const savedTheme = getTheme() || 'system';
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applySystemTheme();

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [applyTheme]);

  return (
    <div className='App'>
      <Router>
        <DelayedSuspense fallback={<PreLoader />} delay={1000}>
          {isAuthenticated() ? (
            <PanelPage />
          ) : (
            <AuthPage />
          )}
          <AlertsList />
        </DelayedSuspense>
      </Router>      
    </div>
  );
}

export default App;