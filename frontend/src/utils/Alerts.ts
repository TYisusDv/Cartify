interface Alert {
    id: string;
    title: string;
    msg: string;
    icon?: string;
    color?: 'blue' | 'red' | 'orange' | 'green' | 'purple';
    timeout?: number;
}

const ALERTS_KEY = 'alerts';

export const getAlerts = (): Alert[] => {
    const alerts = sessionStorage.getItem(ALERTS_KEY);
    return alerts ? JSON.parse(alerts) : [];
};

export const addAlert = (newAlert: Alert) => {
    const alerts = getAlerts();
    const updatedAlerts = [...alerts, newAlert];
    sessionStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));  
    window.dispatchEvent(new Event('alertChanged'));
};

export const removeAlert = (alertId: string) => {
    const alerts = getAlerts();
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    sessionStorage.setItem(ALERTS_KEY, JSON.stringify(updatedAlerts));
    window.dispatchEvent(new Event('alertChanged'));
};