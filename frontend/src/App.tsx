import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AlertType } from './types/alert';
import { isAuthenticated } from './utils/authUtils';
import Alert from './components/Alert';
import PreLoader from './pages/loader/PreLoader';
import DelayedSuspense from './pages/loader/DelayedSuspense';

const AuthPage = React.lazy(() => import('./pages/auth/authPage'));
const PanelPage = React.lazy(() => import('./pages/panelPage'));

function App() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = (alert: AlertType) => {
    setAlerts(prevAlerts => [
      ...prevAlerts,
      { id: alert.id, text: alert.text, timeout: alert.timeout, type: alert.type}
    ]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <Router>
      <div className='App'>
        <div className='flex flex-col absolute top-0 right-0 z-10 p-2 gap-2'>        
          {alerts.map(alert => (
            <Alert key={alert.id} id={alert.id} text={alert.text} type={alert.type} removeAlert={removeAlert} />
          ))}
        </div>        
        <DelayedSuspense fallback={<PreLoader />} delay={1000}>
          {isAuthenticated() ? (
            <PanelPage addAlert={addAlert} /> 
          ) : (
            <AuthPage addAlert={addAlert} /> 
          )}
        </DelayedSuspense>    
      </div>
    </Router>
  );
}

export default App;
