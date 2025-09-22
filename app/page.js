"use client";
import Link from 'next/link';
import { useLang } from '../components/LangProvider';

export default function HomePage() {
	const { t, dir } = useLang();
	return (
		<div className="split-layout" dir={dir}>
			<div className="split-layout__image">
				<img src="/obazaar5.png" alt="Obazaar" className="left-cover" />
			</div>
			<div className="split-layout__form">
				<div className="card">
					<h1>{t('home_title')}</h1>
					<p className="muted">{t('home_subtitle')}</p>
					<div style={{height: 12}} />
					<Link href="/register"><button>{t('get_started')}</button></Link>
				</div>
			</div>
		</div>
	);
}

