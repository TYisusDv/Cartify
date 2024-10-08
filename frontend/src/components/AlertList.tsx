import React, { useEffect, useState } from 'react';
import { getAlerts, removeAlert } from '../utils/Alerts';
import Alert from './Alert';

const AlertsList: React.FC = () => {
  const [alerts, setAlerts] = useState(getAlerts());

  useEffect(() => {
    const handleEvent = () => {
      setAlerts(getAlerts());
    };

    window.addEventListener('alertChanged', handleEvent);

    return () => {
      window.removeEventListener('alertChanged', handleEvent);
    };
  }, []);

  const handleRemoveAlert = (alertId: string) => {
    removeAlert(alertId);
    setAlerts(getAlerts());
  };

  return (
    <div className='fixed top-0 right-0 flex flex-col gap-2 w-full max-w-80 p-3 overflow-hidden transition-all ease-in-out duration-200 z-[99]'>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          title={alert.title}
          msg={alert.msg}
          icon={alert.icon}
          color={alert.color}
          timeout={alert.timeout}
          onClose={() => handleRemoveAlert(alert.id)}
        />
      ))}
    </div>
  );
};

export default AlertsList;
