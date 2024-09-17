import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AlertType } from './types/alert';
import { isAuthenticated } from './utils/authUtils';
import { getTheme } from './utils/themeUtils';
import Alert from './components/Alert';
import PreLoader from './components/PreLoader';
import DelayedSuspense from './components/DelayedSuspense';

const AuthPage = React.lazy(() => import('./pages/auth/authPage'));
const PanelPage = React.lazy(() => import('./pages/panelPage'));

function App() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = useCallback((alert: AlertType) => {
    setAlerts(prevAlerts => [
      ...prevAlerts,
      { id: alert.id, text: alert.text, timeout: alert.timeout, type: alert.type }
    ]);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

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
      <div className='flex flex-col absolute top-0 right-0 p-2 gap-2 z-[99]'>
        {alerts.map(alert => (
          <Alert key={alert.id} id={alert.id} text={alert.text} type={alert.type} removeAlert={removeAlert} />
        ))}
      </div>
      <Router>
        <DelayedSuspense fallback={<PreLoader />} delay={1000}>
          {isAuthenticated() ? (
            <PanelPage addAlert={addAlert} />
          ) : (
            <AuthPage addAlert={addAlert} />
          )}
        </DelayedSuspense>
      </Router>
    </div>
  );
}

export default App;