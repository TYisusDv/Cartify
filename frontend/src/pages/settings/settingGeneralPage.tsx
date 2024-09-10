import React, { useEffect, useState } from 'react';
import { Loading03Icon } from 'hugeicons-react';
import { getTheme, saveTheme } from '../../utils/themeUtils';
import { getLanguage, saveLanguage } from '../../utils/LanguageUtils';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SelectGroup from '../../components/SelectGroup';

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

    const [selectedTheme, setSelectedTheme] = useState<string>('system');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    useEffect(() => {
        const savedTheme = getTheme() || 'system';
        const savedLanguage = getLanguage() || 'en';

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('theme', 'dark');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.add('theme', 'light');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            }
        }

        setSelectedTheme(savedTheme);
        setSelectedLanguage(savedLanguage);
    }, []);

    const handleThemeChange = (value: string) => {
        document.documentElement.classList.remove('dark', 'light', 'theme');

        if (value === 'dark') {
            document.documentElement.classList.add('theme', 'dark');
        } else if (value === 'light') {
            document.documentElement.classList.add('theme', 'light');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            }
        }

        setSelectedTheme(value);
        saveTheme(value);
    };

    const handleLanguageChange = (value: string) => {
        setSelectedLanguage(value);
        saveLanguage(value);
        window.location.reload();
    };

    return (
        <DelayedSuspense fallback={<div className='flex w-full pl-24'><Loading03Icon size={20} className='animate-spin dark:text-white' /></div>} delay={300}>
            <div className='flex flex-col gap-2 w-full p-2'>
                <div className='flex items-center justify-between animate__animated animate__fadeIn animate__faster z-20'>
                    <h3 className='text-sm text-nowrap dark:text-gray-100'>{translations.theme}</h3>
                    <div className='w-full max-w-32'>
                        <SelectGroup options={theme_options} value={selectedTheme} onChange={handleThemeChange} />
                    </div>
                </div>
                <div className='flex items-center justify-between animate__animated animate__fadeIn animate__faster z-10'>
                    <h3 className='text-sm text-nowrap dark:text-gray-100'>{translations.language}</h3>
                    <div className='w-full max-w-32'>
                        <SelectGroup options={language_options} value={selectedLanguage} onChange={handleLanguageChange} />
                    </div>
                </div>
            </div>            
        </DelayedSuspense>
    );
};

export default SettingGeneralPage;
