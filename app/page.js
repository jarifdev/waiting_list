"use client";
import Link from 'next/link';
import { useLang } from '../components/LangProvider';

export default function HomePage() {
	const { t, dir } = useLang();
	return (
		<div className="card" dir={dir}>
			<h1>{t('home_title')}</h1>
			<p className="muted">{t('home_subtitle')}</p>
			<div style={{height: 12}} />
			<Link href="/register"><button>{t('get_started')}</button></Link>
		</div>
	);
}

