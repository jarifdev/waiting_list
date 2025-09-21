"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '../../components/LangProvider';
import { validatePhone, validatePassword, validateCRNumber } from '../../lib/security';

export default function RegisterPage() {
    const { t, dir } = useLang();
	const [account, setAccount] = useState({ email: '', phone: '', countryCode: '+968', username: '', password: '' });
	const [store, setStore] = useState({ 
		storeName: '', 
		crNumber: '', 
		logoImage: null,
		bannerImage: null 
	});
	const [previewImage, setPreviewImage] = useState(null);
	const [status, setStatus] = useState({ type: '', message: '' });
	const [errors, setErrors] = useState({});
	const [busy, setBusy] = useState(false);
    const router = useRouter();



	async function submit() {
		setBusy(true);
		setStatus({ type: '', message: '' });
		setErrors({});
		
		// Client-side validation
		const newErrors = {};
		if (!account.phone) {
			newErrors.phone = t('phone_required');
		} else if (!validatePhone(account.phone)) {
			newErrors.phone = t('phone_invalid');
		}
		if (!account.password) {
			newErrors.password = t('password_required');
		} else if (!validatePassword(account.password)) {
			newErrors.password = t('password_min');
		}
		if (!store.crNumber) {
			newErrors.crNumber = t('cr_required');
		} else if (!validateCRNumber(store.crNumber)) {
			newErrors.crNumber = t('cr_invalid');
		}
		
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setBusy(false);
			return;
		}
		const apiUrl=process.env.API_URL;
		try {
			const form = new FormData();
			const payload = {
				account,
				store: {
					storeName: store.storeName,
					crNumber: store.crNumber
				}
			};
			form.append('payload', JSON.stringify(payload));
			if (store.logoImage) form.append('logoImage', store.logoImage);
			if (store.bannerImage) form.append('bannerImage', store.bannerImage);
			const res = await fetch(`/api/register`, { method: 'POST', body: form });
			const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed');
            setAccount({ email: '', phone: '', countryCode: '+968', username: '', password: '' });
            setStore({ 
                storeName: '', 
                crNumber: '',
                logoImage: null,
                bannerImage: null 
            });
            setPreviewImage(null);
            router.push('/submitted');
		} catch (e) {
			setStatus({ type: 'error', message: e.message || 'Something went wrong' });
		} finally {
			setBusy(false);
		}
	}

    return (
        <div className="split-layout" dir={dir}>
            <div className="split-layout__image">
                <img src="/logo.png" alt="Company Logo" />
                <h1>{t('form_title')}</h1>
                <p>{t('form_subtitle')}</p>
                {previewImage ? (
                    <img src={previewImage} alt="Preview" className="image-preview" />
                ) : (
                    <div className="muted">{t('image_preview')}</div>
                )}
            </div>
            <div className="split-layout__form">
                <div className="card">
                    <h2>{t('form_title')}</h2>
                    <p className="muted">{t('form_subtitle')}</p>

                <div className="file-input-wrapper">
                        <label>{t('logo_image')}</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (file && file.type.startsWith('image/')) {
                                    setStore(prev => ({ ...prev, logoImage: file }));
                                    setPreviewImage(URL.createObjectURL(file));
                                }
                            }} 
                        />
                    </div>

                    <div className="file-input-wrapper">
                        <label>{t('banner_image')}</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                if (file && file.type.startsWith('image/')) {
                                    setStore(prev => ({ ...prev, bannerImage: file }));
                                }
                            }} 
                        />
                    </div>

                    <label>{t('email')}</label>
                    <input value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })} placeholder="you@example.com" type="email" />
                
                <div className="row">
					<div>
						<label>{t('country_code')}</label>
						<select value={account.countryCode} onChange={e => setAccount({ ...account, countryCode: e.target.value })}>
							<option value="+968">🇴🇲 +968 (Oman)</option>
							<option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
							<option value="+971">🇦🇪 +971 (UAE)</option>
							<option value="+965">🇰🇼 +965 (Kuwait)</option>
							<option value="+974">🇶🇦 +974 (Qatar)</option>
							<option value="+973">🇧🇭 +973 (Bahrain)</option>
							<option value="+1">🇺🇸 +1 (USA)</option>
							<option value="+44">🇬🇧 +44 (UK)</option>
							<option value="+33">🇫🇷 +33 (France)</option>
							<option value="+49">🇩🇪 +49 (Germany)</option>
						</select>
					</div>
					<div>
						<label>{t('phone')}</label>
						<input value={account.phone} onChange={e => setAccount({ ...account, phone: e.target.value })} placeholder="5xxxxxxxx" type="tel" />
						{errors.phone && <div className="error">{errors.phone}</div>}
					</div>
				</div>

				<div className="row">
					<div>
                        <label>{t('username')}</label>
						<input value={account.username} onChange={e => setAccount({ ...account, username: e.target.value })} placeholder="your-username" />
					</div>
					<div>
                        <label>{t('password')}</label>
						<input value={account.password} onChange={e => setAccount({ ...account, password: e.target.value })} type="password" placeholder="password" />
						{errors.password && <div className="error">{errors.password}</div>}
					</div>
				</div>

				<div className="row">
					<div>
                        <label>{t('store_name')}</label>
						<input value={store.storeName} onChange={e => setStore({ ...store, storeName: e.target.value })} placeholder="My Store" />
					</div>
					<div>
                        <label>{t('cr_number')}</label>
						<input value={store.crNumber} onChange={e => setStore({ ...store, crNumber: e.target.value })} placeholder="123456" />
						{errors.crNumber && <div className="error">{errors.crNumber}</div>}
					</div>
				</div>

                <div style={{ height: 16 }} />
                {status.type === 'error' && <div className="error">{status.message}</div>}
                <div className="actions">
                    <button disabled={busy} onClick={submit}>{busy ? 'Submitting…' : t('submit')}</button>
                </div>
                </div>
            </div>
        </div>
    );
}

