import { useEffect, useState } from 'react';

const useTranslations = () => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const language = navigator.language.split('-')[0];
        const translationModule = await import(`../locales/${language}.json`);
        setTranslations(translationModule.default);
      } catch (err) {
        const defaultTranslation = await import(`../locales/en.json`);
        setTranslations(defaultTranslation.default);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, []);

  return { translations, loading };
};

export default useTranslations;