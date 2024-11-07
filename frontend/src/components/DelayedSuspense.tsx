import React, { useEffect, useState, ReactNode } from 'react';

interface DelayedSuspenseProps {
  children: ReactNode;
  fallback: ReactNode;
  delay?: number;
}

const DelayedSuspense: React.FC<DelayedSuspenseProps> = ({ children, fallback, delay = 1000 }) => {
  const [show, setShow] = useState(true);
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);
  */
  return (
    <React.Suspense fallback={fallback}>
      {show ? children : fallback}
    </React.Suspense>
  );
};

export default DelayedSuspense;
