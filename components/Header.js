"use client";
import { useLang } from './LangProvider';

export default function Header() {
	const { lang, setLang, t, dir } = useLang();
	return (
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }} dir={dir}>
			<h3 style={{ margin: 0 }}>{t('brand_title')}</h3>
			<div className="actions">
				<button type="button" onClick={() => setLang('en')} style={{ opacity: lang === 'en' ? 1 : 0.7 }}>{t('en')}</button>
				<button type="button" onClick={() => setLang('ar')} style={{ opacity: lang === 'ar' ? 1 : 0.7 }}>{t('ar')}</button>
			</div>
		</div>
	);
}

