import React, { Suspense, useState } from 'react';
import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { Analytics02Icon, BarCode02Icon, BrandfetchIcon, CreditCardIcon, DashboardSquare01Icon, DistributionIcon, Layers01Icon, Loading03Icon, LocationUser04Icon, LogoutSquare01Icon, SearchAreaIcon, SearchList02Icon, Settings02Icon, ShoppingBasketSecure03Icon, ShoppingCartCheck02Icon, StoreLocation02Icon, TaxesIcon, UserGroupIcon } from 'hugeicons-react';
import useTranslations from '../hooks/useTranslations';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorPage from './errorPage';
import Modal from '../components/Modal';
import DropdownMenu from '../components/DropdownMenu';

const HomePage = React.lazy(() => import('../pages/homePage'));
const AuthLogoutPage = React.lazy(() => import('../pages/auth/authLogoutPage'));
const AppPOSPage = React.lazy(() => import('./app/pos/AppPOSPage'));
const AppInventoryPage = React.lazy(() => import('./app/inventory/AppInventoryPage'));
const AppInventoryTransferPage = React.lazy(() => import('./app/inventory/transfer/AppInventoryTransferPage'));
const ManageUsersPage = React.lazy(() => import('./manage/manageUsersPage'));
const ManageClientsPage = React.lazy(() => import('./manage/clients/ManageClientsPage'));
const ManageTaxesPage = React.lazy(() => import('./manage/taxes/ManageTaxesPage'));
const ManageSuppliersPage = React.lazy(() => import('./manage/suppliers/ManageSuppliersPage'));
const ManageProductsPage = React.lazy(() => import('./manage/product/ManageProductsPage'));
const ManageProductBrandsPage = React.lazy(() => import('./manage/product/brands/ManageProductBrandsPage'));
const ManageProductCategoriesPage = React.lazy(() => import('./manage/product/categories/ManageProductCategoriesPage'));
const ManageInventoryTypesPage = React.lazy(() => import('./app/inventory/types/ManageInventoryTypesPage'));
const ManagePaymentMethodsPage = React.lazy(() => import('./manage/paymentmethods/ManagePaymentMethodsPage'));
const ManageSalesPage = React.lazy(() => import('./manage/sales/ManageSalesPage'));
const ManageSalePayments = React.lazy(() => import('./manage/sales/payments/Payments'));
const SettingGeneralPage = React.lazy(() => import('../pages/settings/settingGeneralPage'));

const PanelPage: React.FC = () => {
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
      <nav className='fixed flex flex-col w-[260px] h-full border-r-2 border-gray-100 gap-2 p-8 z-[1] dark:border-r-slate-600'>
        <div className='w-full'>
          <h1 className='text-2xl font-bold dark:text-white'>Cartify</h1>
        </div>
        <ul className='flex flex-col mt-16 gap-2'>
          <li><Link to='/home' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/home')}`}><DashboardSquare01Icon /> {translations.home}</Link></li>
          <hr className='border dark:border-slate-600' />
          <li><Link to='/app/pos' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/app/pos')}`}><ShoppingCartCheck02Icon /> {translations.point_of_sell}</Link></li>
          <li>
            <DropdownMenu 
              label={translations.inventory} 
              icon={<SearchList02Icon className='w-7' />}
              links={['/app/inventory', '/app/inventory/transfer', '/manage/inventory/types']}

            >
                <li><Link to='/app/inventory' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/app/inventory')}`}><SearchList02Icon size={20} /> {translations.inventory}</Link></li>
                <li><Link to='/app/inventory/transfer' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/app/inventory/transfer')}`}><SearchList02Icon size={20} /> Traslaciones</Link></li>
                <li><Link to='/manage/inventory/types' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/inventory/types')}`}><SearchAreaIcon size={20} /> {translations.types}</Link></li>
            </DropdownMenu>
          </li>
          <li><Link to='/statistics' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/statistics')}`}><Analytics02Icon />  {translations.statistics}</Link></li>
          <hr className='border dark:border-slate-600' />
          <li><Link to='/manage/users' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/users')}`}><UserGroupIcon />  {translations.users}</Link></li>
          <li><Link to='/manage/clients' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/clients')}`}><LocationUser04Icon />  {translations.clients}</Link></li>
          <li><Link to='/manage/locations' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/locations')}`}><StoreLocation02Icon />  {translations.locations}</Link></li>
          <li><Link to='/manage/taxes' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/taxes')}`}><TaxesIcon />  {translations.taxes}</Link></li>
          <li>
            <DropdownMenu
              label={translations.products}
              icon={<BarCode02Icon className='w-7' />}
              links={['/manage/products', '/manage/product/brands', '/manage/product/categories']}
            >
              <li><Link to='/manage/products' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/products')}`}><BarCode02Icon size={20} /> {translations.products}</Link></li>
              <li><Link to='/manage/product/brands' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/product/brands')}`}><BrandfetchIcon size={20} /> {translations.brands}</Link></li>
              <li><Link to='/manage/product/categories' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/product/categories')}`}><Layers01Icon size={20} /> {translations.categories}</Link></li>
            </DropdownMenu>

          </li>
          <li><Link to='/manage/suppliers' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/suppliers')}`}><DistributionIcon />  {translations.suppliers}</Link></li>
          <li>
            <DropdownMenu
              label={translations.sales}
              icon={<ShoppingBasketSecure03Icon className='w-7' />}
              links={['/manage/sales', '/manage/sales/credit']}
            >
              <li><Link to='/manage/sales' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/sales')}`}><ShoppingBasketSecure03Icon size={20} /> {translations.sales}</Link></li>
              <li><Link to='/manage/paymentmethods' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/paymentmethods')}`}><CreditCardIcon size={20} /> {translations.payment_methods}</Link></li>
            </DropdownMenu>

          </li>
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
            <Route path='/app/pos' element={<AppPOSPage />} />
            <Route path='/app/inventory' element={<AppInventoryPage />} />
            <Route path='/app/inventory/transfer' element={<AppInventoryTransferPage  />} />
            <Route path='/manage/users' element={<ManageUsersPage />} />
            <Route path='/manage/clients' element={<ManageClientsPage  />} />
            <Route path='/manage/taxes' element={<ManageTaxesPage />} />
            <Route path='/manage/suppliers' element={<ManageSuppliersPage />} />
            <Route path='/manage/products' element={<ManageProductsPage />} />
            <Route path='/manage/product/brands' element={<ManageProductBrandsPage />} />
            <Route path='/manage/product/categories' element={<ManageProductCategoriesPage />} />
            <Route path='/manage/inventory/types' element={<ManageInventoryTypesPage />} />
            <Route path='/manage/paymentmethods' element={<ManagePaymentMethodsPage />} />
            <Route path='/manage/sales' element={<ManageSalesPage />} />
            <Route path='/manage/sale/payments' element={<ManageSalePayments />} />
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
      <div id='portal-modal'></div>
    </section>
  );
};

export default PanelPage;