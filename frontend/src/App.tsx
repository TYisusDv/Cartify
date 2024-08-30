import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AlertType } from './types/alert';
import { isAuthenticated } from './utils/authUtils';
import Alert from './components/Alert';

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
        <Suspense fallback={<div>Loading...</div>}>
          {isAuthenticated() ? (
            <PanelPage addAlert={addAlert}/> 
          ) : (
            <AuthPage addAlert={addAlert}/> 
          )}
        </Suspense>        
      </div>
    </Router>
  );
}

export default App;
