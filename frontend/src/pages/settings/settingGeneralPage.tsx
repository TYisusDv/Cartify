import React, { useEffect, useState } from 'react';
import { Loading03Icon } from 'hugeicons-react';
import { getTheme, saveTheme } from '../../utils/themeUtils';
import { getLanguage, saveLanguage } from '../../utils/LanguageUtils';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SelectGroup from '../../components/SelectGroup';
import { handleSelectChange } from '../../utils/formUtils';

const SettingGeneralPage: React.FC = () => {
    const { translations } = useTranslations();

    const theme_options = [
        { value: 'system', label: translations.system },
        { value: 'dark', label: translations.dark },
        { value: 'light', label: translations.light },
    ];

    const language_options = [
        { value: 'en', label: translations.english },
        { value: 'es', label: translations.spanish },
    ];

    const [valuesTheme, setValuesTheme] = useState({ theme: getTheme() });
    const [valuesLanguages, setValuesLanguages] = useState({ language: getLanguage() });

    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light', 'theme');

        if (valuesTheme.theme === 'dark') {
            document.documentElement.classList.add('theme', 'dark');
        } else if (valuesTheme.theme === 'light') {
            document.documentElement.classList.add('theme', 'light');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            }
        }        

        saveTheme(valuesTheme.theme || 'system');
        saveLanguage(valuesLanguages.language || 'en');
    }, [valuesTheme, valuesLanguages]);

    return (
        <DelayedSuspense fallback={<div className='flex w-full pl-24'><Loading03Icon size={20} className='animate-spin dark:text-white' /></div>} delay={300}>
            <div className='flex flex-col gap-2 w-full p-2'>
                <div className='flex items-center justify-between animate__animated animate__fadeIn animate__faster z-20'>
                    <h3 className='text-sm text-nowrap dark:text-gray-100'>{translations.theme}</h3>
                    <div className='w-full max-w-32'>
                        <SelectGroup myOptions={theme_options} name='theme' value={valuesTheme.theme} onChange={handleSelectChange(setValuesTheme)} />
                    </div>
                </div>
                <div className='flex items-center justify-between animate__animated animate__fadeIn animate__faster z-10'>
                    <h3 className='text-sm text-nowrap dark:text-gray-100'>{translations.language}</h3>
                    <div className='w-full max-w-32'>
                        <SelectGroup myOptions={language_options} name='language' value={valuesLanguages.language} onChange={handleSelectChange(setValuesLanguages)} />
                    </div>
                </div>
            </div>            
        </DelayedSuspense>
    );
};

export default SettingGeneralPage;
