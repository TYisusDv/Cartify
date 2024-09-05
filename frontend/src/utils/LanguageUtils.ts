export const LANGUAGE_KEY = 'language';

export const saveLanguage = (language: string) => {
    localStorage.setItem(LANGUAGE_KEY, language);
};

export const getLanguage = () => {
    return localStorage.getItem(LANGUAGE_KEY);
};

export const removeLanguage = () => {
    localStorage.removeItem(LANGUAGE_KEY);
};