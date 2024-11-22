import React, { useEffect, useState } from 'react';
import { LanguageCircleIcon, Loading03Icon, PaintBoardIcon, TextIcon } from 'hugeicons-react';
import { getTheme, saveTheme } from '../../utils/themeUtils';
import { getLanguage, saveLanguage } from '../../utils/LanguageUtils';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import Select from '../../components/Select';
import { getText, saveText } from '../../utils/TextUtils';

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

    const text_options = [
        { value: '16px', label: '16px' },
        { value: '18px', label: '18px' },
        { value: '20px', label: '20px' },
        { value: '22px', label: '22px' },
        { value: '24px', label: '24px' },
    ];

    const [valuesTheme, setValuesTheme] = useState({ theme: getTheme() });
    const [valuesLanguages, setValuesLanguages] = useState({ language: getLanguage() });
    const [valuesText, setValuesText] = useState(getText() || '16px');

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

    useEffect(() => {
        document.documentElement.style.fontSize = valuesText;
        saveText(valuesText);
    }, [valuesText]);

    return (
        <DelayedSuspense fallback={<div className='flex w-full pl-24'><Loading03Icon size={20} className='animate-spin dark:text-white' /></div>} delay={300}>
            <div className='flex flex-col gap-2 w-full'>
                <div className='z-[10]'>
                    <Select
                        props={{
                            id: 'theme',
                            name: 'theme',
                            onChange: (e) => setValuesTheme(prev => ({
                                ...prev,
                                theme: e.target.value
                            })),
                            value: valuesTheme.theme || 'system',
                        }}
                        myOptions={theme_options}
                        icon={<PaintBoardIcon size={20} />}
                        label={translations.theme}
                    />
                </div>
                <div className='z-[9]'>
                    <Select
                        props={{
                            id: 'language',
                            name: 'language',
                            onChange: (e) => setValuesLanguages(prev => ({
                                ...prev,
                                language: e.target.value
                            })),
                            value: valuesLanguages.language || 'en',
                        }}
                        myOptions={language_options}
                        icon={<LanguageCircleIcon size={20} />}
                        label={translations.language}
                    />
                </div>
                <div className='z-[8]'>
                    <Select
                        props={{
                            id: 'text',
                            name: 'text',
                            onChange: (e) => setValuesText(e.target.value),
                            value: valuesText || '16px',
                        }}
                        myOptions={text_options}
                        icon={<TextIcon size={20} />}
                        label='Tamaño de texto'
                    />
                </div>
            </div>
        </DelayedSuspense>
    );
};

export default SettingGeneralPage;
