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
		crNumber: ''
	});
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
		
		// Email validation
		if (!account.email) {
			newErrors.email = t('Email required');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
			newErrors.email = t('Email invalid');
		}

		// Phone validation
		if (!account.phone) {
			newErrors.phone = t('Phone required');
		} else if (!validatePhone(account.phone)) {
			newErrors.phone = t('Phone invalid');
		}

		// Username validation
		if (!account.username) {
			newErrors.username = t('Username required');
		} else if (account.username.length < 3) {
			newErrors.username = t('Username too short');
		}

		// Password validation
		if (!account.password) {
			newErrors.password = t('Password required');
		} else if (!validatePassword(account.password)) {
			newErrors.password = t('Password too short');
		}

		// Store name validation
		if (!store.storeName) {
			newErrors.storeName = t('Store Name Required');
		} else if (store.storeName.length < 1) {
			newErrors.storeName = t('Store Name too short');
		}

		// CR Number validation
		if (!store.crNumber) {
			newErrors.crNumber = t('CR Required');
		} else if (!validateCRNumber(store.crNumber)) {
			newErrors.crNumber = t('cr_invalid');
		}
		
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setBusy(false);
			return;
		}

		try {
			const payload = {
				account,
				store: {
					storeName: store.storeName,
					crNumber: store.crNumber
				}
			};

			const res = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || 'Failed');

			setAccount({ email: '', phone: '', countryCode: '+968', username: '', password: '' });
			setStore({ 
				storeName: '', 
				crNumber: ''
			});

			router.push('/submitted');
		} catch (e) {
			setStatus({ type: 'error', message: e.message || 'Something went wrong' });
		} finally {
			setBusy(false);
		}
	}

    return (
        <div className="split-layout" dir={dir}>
		<div className="split-layout__image register-image" style={{ backgroundImage: "url('/obazaar6.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
				<div className="register-text">
					<h1>{t('form_title')}</h1>
					<p>{t('form_subtitle')}</p>
				</div>
			</div>
            <div className="split-layout__form">
                <div className="card">
                    <h2>{t('form_title')}</h2>
                    <p className="muted">{t('form_subtitle')}</p>

                    <div className="form-group">
                        <label>{t('email')}</label>
                        <input 
                            value={account.email} 
                            onChange={e => setAccount({ ...account, email: e.target.value })} 
                            placeholder="you@example.com" 
                            type="email" 
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                
                    <div className="row">
                        <div className="form-group">
                            <label>{t('country_code')}</label>
                            <select 
                                value={account.countryCode} 
                                onChange={e => setAccount({ ...account, countryCode: e.target.value })}
                            >
                                <option value="+968">🇴🇲 +968 (Oman)</option>
                                <option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
                                <option value="+971">🇦🇪 +971 (UAE)</option>
                                <option value="+965">🇰🇼 +965 (Kuwait)</option>
                                <option value="+974">🇶🇦 +974 (Qatar)</option>
                                <option value="+973">🇧🇭 +973 (Bahrain)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t('phone')}</label>
                            <input 
                                value={account.phone} 
                                onChange={e => setAccount({ ...account, phone: e.target.value })} 
                                placeholder="xxxxxxxx" 
                                type="tel" 
                            />
                            {errors.phone && <div className="error">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label>{t('username')}</label>
                            <input 
                                value={account.username} 
                                onChange={e => setAccount({ ...account, username: e.target.value })} 
                                placeholder="Username" 
                            />
                            {errors.username && <div className="error">{errors.username}</div>}
                        </div>
                        <div className="form-group">
                            <label>{t('password')}</label>
                            <input 
                                value={account.password} 
                                onChange={e => setAccount({ ...account, password: e.target.value })} 
                                type="password" 
                                placeholder="Password" 
                            />
                            {errors.password && <div className="error">{errors.password}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label>{t('store_name')}</label>
                            <input 
                                value={store.storeName} 
                                onChange={e => setStore({ ...store, storeName: e.target.value })} 
                                placeholder="My Store" 
                            />
                            {errors.storeName && <div className="error">{errors.storeName}</div>}
                        </div>
                        <div className="form-group">
                            <label>{t('cr_number')}</label>
                            <input 
                                value={store.crNumber} 
                                onChange={e => setStore({ ...store, crNumber: e.target.value })} 
                                placeholder="123456" 
                            />
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

