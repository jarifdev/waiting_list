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
			<div className="logo-container">
				<img src="/obazaar.png" alt="Obazaar" style={{ height: '40px', width: 'auto' }} />
			</div>
			<div style={{ display: 'flex', gap: '1rem' }}>
				<button type="button" onClick={() => setLang('en')} style={{ 
					opacity: lang === 'en' ? 1 : 0.7,
					padding: '0.5rem 1rem',
					background: 'transparent',
					border: '1px solid var(--accent)'
				}}>English</button>
				<button type="button" onClick={() => setLang('ar')} style={{ 
					opacity: lang === 'ar' ? 1 : 0.7,
					padding: '0.5rem 1rem',
					background: 'transparent',
					border: '1px solid var(--accent)'
				}}>عربي</button>
			</div>
		</nav>
	);
}

