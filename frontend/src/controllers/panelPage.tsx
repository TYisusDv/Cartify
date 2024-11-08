import React, { Suspense, useState } from 'react';
import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import { Analytics02Icon, BarCode02Icon, BrandfetchIcon, Cash01Icon, CreditCardIcon, DashboardBrowsingIcon, DashboardSquare01Icon, DistributionIcon, Invoice02Icon, Layers01Icon, Loading03Icon, LocationUser04Icon, LogoutSquare01Icon, SearchAreaIcon, SearchList02Icon, Settings02Icon, ShoppingBasketSecure03Icon, ShoppingCartCheck02Icon, StoreLocation02Icon, TaxesIcon, UserAccountIcon, UserGroupIcon, WaterfallDown01Icon, WaterfallUp01Icon } from 'hugeicons-react';
import useTranslations from '../hooks/useTranslations';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorPage from '../pages/errorPage';
import Modal from '../components/Modal';
import DropdownMenu from '../components/DropdownMenu';

const AuthLogoutPage = React.lazy(() => import('../pages/auth/authLogoutPage'));
const AppPOSPage = React.lazy(() => import('../pages/app/pos/AppPOSPage'));
const AppInventoryPage = React.lazy(() => import('../pages/app/inventory/AppInventoryPage'));
const AppInventoryTransferPage = React.lazy(() => import('../pages/app/inventory/transfer/AppInventoryTransferPage'));
const StatisticsSales = React.lazy(() => import('../pages/statistics/Sales'));
const ManageUsersPage = React.lazy(() => import('../pages/manage/manageUsersPage'));
const ManageClientsPage = React.lazy(() => import('../pages/manage/clients/ManageClientsPage'));
const ManageIdentifications = React.lazy(() => import('../pages/manage/clients/identifications/Identifications'));
const ManageClientTypes = React.lazy(() => import('../pages/manage/clients/types/Types'));
const ManageLocations = React.lazy(() => import('../pages/manage/locations/Locations'));
const ManageTaxesPage = React.lazy(() => import('../pages/manage/taxes/ManageTaxesPage'));
const ManageSuppliersPage = React.lazy(() => import('../pages/manage/suppliers/ManageSuppliersPage'));
const ManageProductsPage = React.lazy(() => import('../pages/manage/product/ManageProductsPage'));
const ManageProductBrandsPage = React.lazy(() => import('../pages/manage/product/brands/ManageProductBrandsPage'));
const ManageProductCategoriesPage = React.lazy(() => import('../pages/manage/product/categories/ManageProductCategoriesPage'));
const ManageInventoryTypesPage = React.lazy(() => import('../pages/app/inventory/types/ManageInventoryTypesPage'));
const ManagePaymentMethodsPage = React.lazy(() => import('../pages/manage/paymentmethods/ManagePaymentMethodsPage'));
const ManageSalesPage = React.lazy(() => import('../pages/manage/sales/ManageSalesPage'));
const ManageSalePayments = React.lazy(() => import('../pages/manage/sales/payments/Payments'));
const ManageSaleReceipt = React.lazy(() => import('../pages/manage/sales/receipt/Receipt'));
const ManageSaleStatus = React.lazy(() => import('../pages/manage/sales/status/Status'));
const ManageCashRegister = React.lazy(() => import('../pages/manage/cashregister/index/CashRegister'));
const ManageCashRegisterSales = React.lazy(() => import('../pages/manage/cashregister/sales/Sales'));
const ManageExpenses = React.lazy(() => import('../pages/manage/expenses/Expenses'));
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
          <li>
            <DropdownMenu
              label={translations.statistics}
              icon={<Analytics02Icon className='w-7' />}
              links={['/statistics/sales']}
            >
              <li><Link to='/statistics/sales' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/statistics/sales')}`}><Analytics02Icon size={20} /> Ventas</Link></li>
            </DropdownMenu>
          </li>
          <hr className='border dark:border-slate-600' />
          <li>
            <DropdownMenu 
              label={translations.cash_register} 
              icon={<Cash01Icon className='w-7' />}
              links={['/manage/cashregister', '/manage/cashregister/sales']}

            >
                <li><Link to='/manage/cashregister' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/cashregister')}`}><Cash01Icon size={20} /> Gastos</Link></li>
                <li><Link to='/manage/cashregister/sales' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/cashregister/sales')}`}><WaterfallUp01Icon size={20} /> Ingresos</Link></li>
            </DropdownMenu>
          </li>
          <li>
            <DropdownMenu 
              label='Gastos'
              icon={<WaterfallDown01Icon className='w-7' />}
              links={['/manage/expenses']}

            >
                <li><Link to='/manage/expenses' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/expenses')}`}><WaterfallDown01Icon size={20} /> Gastos</Link></li>
            </DropdownMenu>
          </li>
          <li><Link to='/manage/users' className={`flex h-10 items-center text-base hover:text-black gap-3 dark:hover:text-white ${getLinkClass('/manage/users')}`}><UserGroupIcon />  {translations.users}</Link></li>
          <DropdownMenu 
              label={translations.clients} 
              icon={<LocationUser04Icon className='w-7' />}
              links={['/manage/clients','/manage/identifications','/manage/clienttypes']}

            >
                <li><Link to='/manage/clients' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/clients')}`}><LocationUser04Icon size={20} /> {translations.clients}</Link></li>
                <li><Link to='/manage/identifications' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/identifications')}`}><UserAccountIcon size={20} /> {translations.identifications}</Link></li>
                <li><Link to='/manage/clienttypes' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/clienttypes')}`}><UserAccountIcon size={20} /> {translations.client_types}</Link></li>
            </DropdownMenu>
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
              links={['/manage/sales', '/manage/paymentmethods', '/manage/sale/receipt', '/manage/sale/status']}
            >
              <li><Link to='/manage/sales' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/sales')}`}><ShoppingBasketSecure03Icon size={20} /> {translations.sales}</Link></li>
              <li><Link to='/manage/paymentmethods' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/paymentmethods')}`}><CreditCardIcon size={20} /> {translations.payment_methods}</Link></li>
              <li><Link to='/manage/sale/receipt' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/sale/receipt')}`}><Invoice02Icon size={20} /> {translations.receipt}</Link></li>
              <li><Link to='/manage/sale/status' className={`flex h-8 items-center hover:text-black gap-2 dark:hover:text-white ${getLinkClass('/manage/sale/status')}`}><DashboardBrowsingIcon size={20} /> {translations.sale_status}</Link></li>
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
            <Route path='/app/pos' element={<AppPOSPage />} />
            <Route path='/app/inventory' element={<AppInventoryPage />} />
            <Route path='/app/inventory/transfer' element={<AppInventoryTransferPage  />} />
            <Route path='/statistics/sales' element={<StatisticsSales  />} />
            <Route path='/manage/cashregister' element={<ManageCashRegister/>} />
            <Route path='/manage/cashregister/sales' element={<ManageCashRegisterSales/>} />            
            <Route path='/manage/users' element={<ManageUsersPage />} />
            <Route path='/manage/clients' element={<ManageClientsPage  />} />
            <Route path='/manage/identifications' element={<ManageIdentifications  />} />
            <Route path='/manage/clienttypes' element={<ManageClientTypes  />} />
            <Route path='/manage/locations' element={<ManageLocations  />} />
            <Route path='/manage/taxes' element={<ManageTaxesPage />} />
            <Route path='/manage/suppliers' element={<ManageSuppliersPage />} />
            <Route path='/manage/products' element={<ManageProductsPage />} />
            <Route path='/manage/product/brands' element={<ManageProductBrandsPage />} />
            <Route path='/manage/product/categories' element={<ManageProductCategoriesPage />} />
            <Route path='/manage/inventory/types' element={<ManageInventoryTypesPage />} />
            <Route path='/manage/paymentmethods' element={<ManagePaymentMethodsPage />} />
            <Route path='/manage/sales' element={<ManageSalesPage />} />
            <Route path='/manage/sale/payments' element={<ManageSalePayments />} />
            <Route path='/manage/sale/receipt' element={<ManageSaleReceipt />} />
            <Route path='/manage/sale/status' element={<ManageSaleStatus/>} />
            <Route path='/manage/expenses' element={<ManageExpenses />} />
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