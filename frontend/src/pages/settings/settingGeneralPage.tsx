import React, { useEffect, useState } from 'react';
import { Loading03Icon } from 'hugeicons-react';
import { getTheme, saveTheme } from '../../utils/themeUtils';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SelectGroup from '../../components/SelectGroup';

const SettingGeneralPage: React.FC = () => {
    const { translations } = useTranslations();
    const options = [
        { value: 'system', label: translations.system || 'System' },
        { value: 'dark', label: translations.dark || 'Dark' },
        { value: 'light', label: translations.light || 'Light' },
    ];

    const [selectedOption, setSelectedOption] = useState<string>('system');

    useEffect(() => {
        const savedTheme = getTheme() || 'system';

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('theme', 'dark');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.add('theme', 'light');
        } else {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            }
        }

        setSelectedOption(savedTheme);
    }, []);

    const handleSelectChange = (value: string) => {
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

        setSelectedOption(value);
        saveTheme(value);
    };

    return (
        <DelayedSuspense fallback={<div className='flex w-full pl-24'><Loading03Icon size={20} className='animate-spin dark:text-white' /></div>} delay={500}>
            <div className='flex items-center justify-between animate__animated animate__fadeIn'>
                <h3 className='dark:text-gray-100'>Theme</h3>
                <SelectGroup options={options} value={selectedOption} onChange={handleSelectChange} />
            </div>
        </DelayedSuspense>
    );
};

export default SettingGeneralPage;
