"use client";
import Link from 'next/link';
import { useLang } from '../../components/LangProvider';

export default function SubmittedPage() {
	const { t, dir } = useLang();
	return (
		<div className="submitted-page" dir={dir}>
			<div className="submitted-content">
				<h1>{t('submitted_title')}</h1>
				<p className="success">{t('submitted_message')}</p>
				<div className="actions">
					<Link href="/"><button>{t('back_home')}</button></Link>
				</div>
			</div>
		</div>
	);
}

