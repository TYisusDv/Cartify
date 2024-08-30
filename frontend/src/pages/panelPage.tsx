import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AlertType } from '../types/alert';
import { Analytics02Icon, BarCode02Icon, DashboardSquare01Icon, DistributionIcon, LocationUser04Icon, LogoutSquare01Icon, SearchList02Icon, ShoppingBasketSecure03Icon, ShoppingCartCheck02Icon, StoreLocation02Icon, UserGroupIcon } from 'hugeicons-react';
import useTranslations from '../hooks/useTranslations';

interface PanelPageProps {
  addAlert: (alert: AlertType) => void;
}

const HomePage = React.lazy(() => import('../pages/homePage'));

const PanelPage: React.FC<PanelPageProps> = ({ addAlert }) => {
  const { translations } = useTranslations();

  return (
    <section className='panel-page'>
      <nav className='fixed flex flex-col w-[260px] h-full border-r-2 border-gray-100 gap-2 p-8 z-10'>
        <div className='w-full'>
          <h1 className='text-2xl font-bold'>Carsync</h1>
        </div>
        <ul className='flex flex-col mt-16 gap-6'>
          <li><Link to='/home' className='flex text-gray-700 text-base gap-3'><DashboardSquare01Icon /> {translations.home}</Link></li>
          <hr className='-m-2' />
          <li><Link to='/pos' className='flex text-gray-700 text-base gap-3'><ShoppingCartCheck02Icon /> {translations.point_of_sell}</Link></li>
          <li><Link to='/inventory' className='flex text-gray-700 text-base gap-3'><SearchList02Icon />  {translations.inventory}</Link></li>
          <li><Link to='/statistics' className='flex text-gray-700 text-base gap-3'><Analytics02Icon />  {translations.statistics}</Link></li>
          <hr className='-m-2' />
          <li><Link to='/manage/users' className='flex text-gray-700 text-base gap-3'><UserGroupIcon />  {translations.users}</Link></li>
          <li><Link to='/manage/clients' className='flex text-gray-700 text-base gap-3'><LocationUser04Icon />  {translations.clients}</Link></li>
          <li><Link to='/manage/locations' className='flex text-gray-700 text-base gap-3'><StoreLocation02Icon />  {translations.locations}</Link></li>
          <li><Link to='/manage/products' className='flex text-gray-700 text-base gap-3'><BarCode02Icon />  {translations.products}</Link></li>
          <li><Link to='/manage/suppliers' className='flex text-gray-700 text-base gap-3'><DistributionIcon />  {translations.suppliers}</Link></li>
          <li><Link to='/manage/sales' className='flex text-gray-700 text-base gap-3'><ShoppingBasketSecure03Icon />  {translations.sales}</Link></li>

        </ul>
        <ul className='flex flex-col w-full bottom-0 gap-6 mt-auto'>
          <li><a className='flex text-gray-700 text-base gap-3'><LogoutSquare01Icon /> {translations.logout}</a></li>
        </ul>
      </nav>
      <div className='relative flex flex-col w-full h-full pl-[260px]'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </Suspense>
      </div>    
    </section>
  );
};

export default PanelPage;