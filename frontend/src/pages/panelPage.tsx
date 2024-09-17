import React, { Suspense, useState } from 'react';
import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { AlertType } from '../types/alert';
import { Analytics02Icon, BarCode02Icon, DashboardSquare01Icon, DistributionIcon, Loading03Icon, LocationUser04Icon, LogoutSquare01Icon, SearchList02Icon, Settings02Icon, ShoppingBasketSecure03Icon, ShoppingCartCheck02Icon, StoreLocation02Icon, UserGroupIcon } from 'hugeicons-react';
import useTranslations from '../hooks/useTranslations';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorPage from './errorPage';
import Modal from '../components/Modal';

interface PanelPageProps {
  addAlert: (alert: AlertType) => void;
}

const HomePage = React.lazy(() => import('../pages/homePage'));
const AuthLogoutPage = React.lazy(() => import('../pages/auth/authLogoutPage'));
const ManageUsersPage = React.lazy(() => import('./manage/manageUsersPage'));
const ManageClientsPage = React.lazy(() => import('./manage/manageClientsPage'));
const ManageSuppliersPage = React.lazy(() => import('./manage/manageSuppliersPage'));
const SettingGeneralPage = React.lazy(() => import('../pages/settings/settingGeneralPage'));


const PanelPage: React.FC<PanelPageProps> = ({ addAlert }) => {
  const { translations } = useTranslations();
  const [isModalSettingsOpen, setIsModalSettingsOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path ? 'text-black font-semibold dark:text-white' : 'text-gray-700 dark:text-slate-300';
  };

  const getSettingsLinkClass = (hash: string) => {
    const isActive = location.hash === hash;

    return isActive
      ? 'bg-gray-200 rounded-lg dark:text-white dark:bg-slate-600'
      : 'text-gray-700 dark:text-slate-300';
  };

  const openModalSettings = () => {
    setIsModalSettingsOpen(true);
  };

  const closeModalSettings = () => {
    setIsModalSettingsOpen(false);
  };

  return (
    <section className='flex relative h-screen animate__animated animate__fadeIn animate__faster dark:bg-slate-800'>
      <nav className='fixed flex flex-col w-[260px] h-full border-r-2 border-gray-100 gap-2 p-8 z-10 dark:border-r-slate-600'>
        <div className='w-full'>
          <h1 className='text-2xl font-bold dark:text-white'>Carsync</h1>
        </div>
        <ul className='flex flex-col mt-16 gap-2'>
          <li><Link to='/home' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/home')}`}><DashboardSquare01Icon /> {translations.home}</Link></li>
          <hr className='border dark:border-slate-600' />
          <li><Link to='/pos' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/pos')}`}><ShoppingCartCheck02Icon /> {translations.point_of_sell}</Link></li>
          <li><Link to='/inventory' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/inventory')}`}><SearchList02Icon />  {translations.inventory}</Link></li>
          <li><Link to='/statistics' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/statistics')}`}><Analytics02Icon />  {translations.statistics}</Link></li>
          <hr className='border dark:border-slate-600' />
          <li><Link to='/manage/users' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/users')}`}><UserGroupIcon />  {translations.users}</Link></li>
          <li><Link to='/manage/clients' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/clients')}`}><LocationUser04Icon />  {translations.clients}</Link></li>
          <li><Link to='/manage/locations' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/locations')}`}><StoreLocation02Icon />  {translations.locations}</Link></li>
          <li><Link to='/manage/products' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/products')}`}><BarCode02Icon />  {translations.products}</Link></li>
          <li><Link to='/manage/suppliers' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/suppliers')}`}><DistributionIcon />  {translations.suppliers}</Link></li>
          <li><Link to='/manage/sales' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/sales')}`}><ShoppingBasketSecure03Icon />  {translations.sales}</Link></li>
        </ul>
        <ul className='flex flex-col w-full bottom-0 gap-6 mt-auto'>
          <li className='flex justify-between items-center'>
            <Link to='/auth/logout' className={`flex text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/auth/logout')}`}>
              <LogoutSquare01Icon /> {translations.logout}
            </Link>
            <Link to='#settings/general' className='text-gray-700 bg-gray-200 rounded-full p-1 hover:bg-blue-600 hover:text-white dark:text-slate-300 dark:bg-slate-600 dark:hover:bg-blue-600' onClick={openModalSettings}>
              <Settings02Icon />
            </Link>
          </li>
        </ul>
      </nav>
      <div className='panel-content relative flex flex-col w-full h-full pl-[260px] overflow-auto'>
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/manage/users' element={<ManageUsersPage />} />
            <Route path='/manage/clients' element={<ManageClientsPage addAlert={addAlert} />} />
            <Route path='/manage/suppliers' element={<ManageSuppliersPage addAlert={addAlert} />} />
            <Route path='/auth/logout' element={<AuthLogoutPage />} />
            <Route path='*' element={<ErrorPage code={404} detail={translations.error_404} />} />
          </Routes>
        </Suspense>
      </div>
      {isModalSettingsOpen && (
        <Modal title={translations.settings} onClose={closeModalSettings}>
          <div className='flex items-center gap-12'>
            <ul>
              <li><Link to='#settings/general' className={`flex w-44 text-base p-2 hover:text-black gap-3 dark:hover:text-white ${getSettingsLinkClass('#settings/general')}`}><Settings02Icon />  {translations.general}</Link></li>
            </ul>
            <Suspense fallback={<div className='flex w-full pl-24'><Loading03Icon size={20} className='animate-spin dark:text-white' /></div>}>
              <Routes>
                {location.hash === '#settings/general' && (
                  <Route path='*' element={<SettingGeneralPage />} />
                )}
              </Routes>
            </Suspense>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default PanelPage;