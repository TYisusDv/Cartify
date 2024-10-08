import React, { useEffect, useState } from 'react';
import { Alert01Icon, Cancel01Icon, CheckmarkCircle02Icon } from 'hugeicons-react';

interface AlertProps {
    title: string;
    msg: string;
    color?: 'blue' | 'red' | 'orange' | 'green' | 'purple';
    icon?: string;
    timeout?: number;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ color = 'blue', icon, title, msg, timeout, onClose }) => {
    const [visible, setVisible] = useState(true);
    const iconClasses: Record<string, string> = {
        blue: 'bg-blue-500 text-white',
        red: 'bg-red-500 text-white',
        orange: 'bg-orange-500 text-white',
        green: 'bg-green-500 text-white',
        purple: 'bg-purple-500 text-white',
    };

    const iconClass = iconClasses[color];

    const iconMap: Record<string, JSX.Element> = {
        Alert01Icon: <Alert01Icon className='w-7 h-7' />,
        CheckmarkCircle02Icon: <CheckmarkCircle02Icon className='w-7 h-7' />,
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onClose(), 300);
    };

    useEffect(() => {
        setTimeout(() => {
            setVisible(false);
            setTimeout(() => onClose(), 300);
        }, timeout)
    }, [])

    return (
        <div className={`flex items-center justify-between gap-2 w-full p-3 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 ${visible ? 'animate-fade-in' : 'animate-fade-out'}`}>
            <div className='flex items-center gap-3'>
                <span className={`flex items-center justify-center p-2 rounded-full ${iconClass}`}>{icon ? iconMap[icon] : null}</span>
                <div className='flex flex-col w-full'>
                    <h2 className='font-medium text-black dark:text-white'>{title}</h2>
                    <p className='text-sm -mt-1 text-gray-700 dark:text-gray-300'>{msg}</p>
                </div>
            </div>
            <span className='w-5 mr-2 cursor-pointer text-black hover:text-red-500 dark:text-white' onClick={handleClose}>
                <Cancel01Icon className='h-5 w-5' />
            </span>
        </div>
    );
};

export default Alert;