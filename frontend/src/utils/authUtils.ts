export const TOKEN_KEY = 'accessToken';

export const saveToken = (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};