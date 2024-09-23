import React from 'react';
import SelectGroup from '../../../components/SelectGroup';
import { handleSelectChange } from '../../../utils/formUtils';
import useTranslations from '../../../hooks/useTranslations';

interface FiltersPageProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
}

const FiltersPage: React.FC<FiltersPageProps> = ({ formValues, setFormValues }) => {
    const { translations } = useTranslations();

    return (
        <div className='flex gap-2 w-full'>
            <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2 max-w-80'>
                <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.brand}</h3>
                <div className='w-full'>
                    <SelectGroup
                        endpoint='manage/product/brands'
                        name='brand.id'
                        onChange={setFormValues ? handleSelectChange(setFormValues) : undefined}
                        value={formValues.brand?.id || 0}
                    />
                </div>
            </div>
            <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2 max-w-80'>
                <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.category}</h3>
                <div className='w-full'>
                    <SelectGroup
                        endpoint='manage/product/categories'
                        name='category.id'
                        onChange={setFormValues ? handleSelectChange(setFormValues) : undefined}
                        value={formValues.category?.id || 0}
                    />
                </div>
            </div>            
        </div>
    );
};

export default FiltersPage;