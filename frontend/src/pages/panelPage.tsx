import React, { Suspense } from 'react';
import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { AlertType } from '../types/alert';
import { Analytics02Icon, BarCode02Icon, DashboardSquare01Icon, DistributionIcon, LocationUser04Icon, LogoutSquare01Icon, SearchList02Icon, ShoppingBasketSecure03Icon, ShoppingCartCheck02Icon, StoreLocation02Icon, UserGroupIcon } from 'hugeicons-react';
import useTranslations from '../hooks/useTranslations';
import SkeletonLoader from '../components/SkeletonLoader';

interface PanelPageProps {
  addAlert: (alert: AlertType) => void;
}

const HomePage = React.lazy(() => import('../pages/homePage'));
const AuthLogoutPage = React.lazy(() => import('../pages/auth/authLogoutPage'));
const ManageUsersPage = React.lazy(() => import('../pages/manage/manageUsersPage'));

const PanelPage: React.FC<PanelPageProps> = ({ addAlert }) => {
  const { translations } = useTranslations();
  const location = useLocation(); 

  const getLinkClass = (path: string) => {
    return location.pathname === path ? 'text-black font-semibold' : 'text-gray-700';
  };

  return (
    <section className='flex relative h-screen animate__animated animate__fadeIn'>
      <nav className='fixed flex flex-col w-[260px] h-full border-r-2 border-gray-100 gap-2 p-8 z-10'>
        <div className='w-full'>
          <h1 className='text-2xl font-bold'>Carsync</h1>
        </div>
        <ul className='flex flex-col mt-16 gap-6'>
          <li><Link to='/home' className={`flex text-base gap-3 ${getLinkClass('/home')}`}><DashboardSquare01Icon /> {translations.home}</Link></li>
          <hr className='-m-2' />
          <li><Link to='/pos' className={`flex text-base gap-3 ${getLinkClass('/pos')}`}><ShoppingCartCheck02Icon /> {translations.point_of_sell}</Link></li>
          <li><Link to='/inventory' className={`flex text-base gap-3 ${getLinkClass('/inventory')}`}><SearchList02Icon />  {translations.inventory}</Link></li>
          <li><Link to='/statistics' className={`flex text-base gap-3 ${getLinkClass('/statistics')}`}><Analytics02Icon />  {translations.statistics}</Link></li>
          <hr className='-m-2' />
          <li><Link to='/manage/users' className={`flex text-base gap-3 ${getLinkClass('/manage/users')}`}><UserGroupIcon />  {translations.users}</Link></li>
          <li><Link to='/manage/clients' className={`flex text-base gap-3 ${getLinkClass('/manage/clients')}`}><LocationUser04Icon />  {translations.clients}</Link></li>
          <li><Link to='/manage/locations' className={`flex text-base gap-3 ${getLinkClass('/manage/locations')}`}><StoreLocation02Icon />  {translations.locations}</Link></li>
          <li><Link to='/manage/products' className={`flex text-base gap-3 ${getLinkClass('/manage/products')}`}><BarCode02Icon />  {translations.products}</Link></li>
          <li><Link to='/manage/suppliers' className={`flex text-base gap-3 ${getLinkClass('/manage/suppliers')}`}><DistributionIcon />  {translations.suppliers}</Link></li>
          <li><Link to='/manage/sales' className={`flex text-base gap-3 ${getLinkClass('/manage/sales')}`}><ShoppingBasketSecure03Icon />  {translations.sales}</Link></li>
        </ul>
        <ul className='flex flex-col w-full bottom-0 gap-6 mt-auto'>
          <li><Link to='/auth/logout' className={`flex text-base gap-3 ${getLinkClass('/auth/logout')}`}><LogoutSquare01Icon /> {translations.logout}</Link></li>
        </ul>
      </nav>
      <div className='relative flex flex-col w-full h-full pl-[260px]'>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/manage/users' element={<ManageUsersPage />} />
            <Route path='/auth/logout' element={<AuthLogoutPage />} />
          </Routes>
        </Suspense>
      </div>    
    </section>
  );
};

export default PanelPage;