export const THEME_KEY = 'theme';

export const saveTheme = (theme: string) => {
    localStorage.setItem(THEME_KEY, theme);
};

export const getTheme = () => {
    return localStorage.getItem(THEME_KEY);
};

export const removeTheme = () => {
    localStorage.removeItem(THEME_KEY);
};