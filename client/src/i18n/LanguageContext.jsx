import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTranslation } from './translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'vi';
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const t = useCallback((key, params = {}) => {
        return getTranslation(language, key, params);
    }, [language]);

    const changeLanguage = useCallback((lang) => {
        setLanguage(lang);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
