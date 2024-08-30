import React, { useState } from 'react';
import AuthPage from './pages/auth/authPage';
import Alert from './components/Alert';
import { AlertType } from './types/alert';

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
    <div className='App'>
      <div className='flex flex-col absolute top-0 right-0 z-10 p-2 gap-2'>        
        {alerts.map(alert => (
          <Alert key={alert.id} id={alert.id} text={alert.text} type={alert.type} removeAlert={removeAlert} />
        ))}
      </div>

      <AuthPage addAlert={addAlert}/>
    </div>
  );
}

export default App;
