"use client";
import { createContext, useContext, useState, useMemo } from 'react';
import { translations } from '../lib/i18n';

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k, dir: 'ltr' });

export function LangProvider({ children }) {
	const [lang, setLang] = useState('en');
	const t = useMemo(() => (key) => translations[lang]?.[key] ?? key, [lang]);
	const dir = lang === 'ar' ? 'rtl' : 'ltr';
	return (
		<LangContext.Provider value={{ lang, setLang, t, dir }}>
			{children}
		</LangContext.Provider>
	);
}

export function useLang() {
	return useContext(LangContext);
}

