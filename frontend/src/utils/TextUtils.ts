export const TEXT_KEY = 'text';

export const saveText = (text: string) => {
    localStorage.setItem(TEXT_KEY, text);
};

export const getText = () => {
    return localStorage.getItem(TEXT_KEY);
};

export const removeText = () => {
    localStorage.removeItem(TEXT_KEY);
};