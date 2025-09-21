"use client";
import { useLang } from './LangProvider';

export default function Header() {
	const { lang, setLang, t, dir } = useLang();
	return (
		<nav style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center', 
				padding: '1rem 2rem',
				width: '100%',
				position: 'fixed',
				top: 0,
				left: 0,
				zIndex: 1000,
				background: 'var(--bg)'
			}} dir={dir}>
			<h3 style={{ margin: 0, fontSize: '1.5rem' }}>{t('brand_title')}</h3>
			<div style={{ display: 'flex', gap: '1rem' }}>
				<button type="button" onClick={() => setLang('en')} style={{ 
					opacity: lang === 'en' ? 1 : 0.7,
					padding: '0.5rem 1rem',
					background: 'transparent',
					border: '1px solid var(--accent)'
				}}>{t('en')}</button>
				<button type="button" onClick={() => setLang('ar')} style={{ 
					opacity: lang === 'ar' ? 1 : 0.7,
					padding: '0.5rem 1rem',
					background: 'transparent',
					border: '1px solid var(--accent)'
				}}>{t('ar')}</button>
			</div>
		</nav>
	);
}

