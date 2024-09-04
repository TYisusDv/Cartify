import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/authUtils';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';

const AuthLogoutPage: React.FC = () => {
  const { translations } = useTranslations();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      removeToken();
      navigate('/', { replace: true }); 
      window.location.reload();
    }, 2000);
  }, [navigate]);

  return (
    <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>        
      <div className='flex flex-col w-full p-8 animate__animated animate__fadeIn'>
          <h1 className='text-2xl font-bold dark:text-white'>{translations.logout}</h1>
          <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.session_closing} </span>
      </div>
      <div className='flex p-8'>
  
      </div>
    </DelayedSuspense>
  );
};

export default AuthLogoutPage;