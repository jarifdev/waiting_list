"use client";
import Link from 'next/link';
import { useLang } from '../../components/LangProvider';

export default function SubmittedPage() {
	const { t, dir } = useLang();
	return (
		<div className="container" dir={dir}>
			<div className="card">
				<h2>{t('submitted_title')}</h2>
				<p className="success">{t('submitted_message')}</p>
				<div className="actions">
					<Link href="/"><button>{t('back_home')}</button></Link>
				</div>
			</div>
		</div>
	);
}

