import React, { useEffect, useState } from 'react';
import { Loading03Icon } from 'hugeicons-react';
import { getTheme, saveTheme } from '../../utils/themeUtils';
import { getLanguage, saveLanguage } from '../../utils/LanguageUtils';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';

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
                
            </div>            
        </DelayedSuspense>
    );
};

export default SettingGeneralPage;
