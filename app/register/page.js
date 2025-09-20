"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '../../components/LangProvider';
import { validatePhone, validatePassword, validateCRNumber } from '../../lib/security';

function emptyProduct() {
	return { name: '', description: '', price: '', sku: '', imageFile: null };
}

export default function RegisterPage() {
    const { t, dir } = useLang();
	const [account, setAccount] = useState({ email: '', phone: '', countryCode: '+968', username: '', password: '' });
	const [store, setStore] = useState({ storeName: '', crNumber: '' });
	const [products, setProducts] = useState([emptyProduct()]);
	const [status, setStatus] = useState({ type: '', message: '' });
	const [errors, setErrors] = useState({});
	const [busy, setBusy] = useState(false);
    const router = useRouter();

	function setProductValue(index, key, value) {
		setProducts(prev => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
	}

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
		const apiUrl=process.env.API_URL
		try {
			const form = new FormData();
			const payload = {
				account,
				store,
				products: products.map(p => ({ name: p.name, description: p.description, price: p.price, sku: p.sku })),
			};
			form.append('payload', JSON.stringify(payload));
			products.forEach((p, i) => {
				if (p.imageFile) form.append(`productImage_${i}`, p.imageFile);
			});
			const res = await fetch(`/api/register`, { method: 'POST', body: form });
			const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed');
            setAccount({ email: '', phone: '', countryCode: '+968', username: '', password: '' });
            setStore({ storeName: '', crNumber: '' });
            setProducts([emptyProduct()]);
            router.push('/submitted');
		} catch (e) {
			setStatus({ type: 'error', message: e.message || 'Something went wrong' });
		} finally {
			setBusy(false);
		}
	}

    return (
        <div className="container" dir={dir}>
            <div className="card">
                <h2>{t('form_title')}</h2>
                <p className="muted">{t('form_subtitle')}</p>

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

                <h3>{t('products')}</h3>
				<div className="products">
					{products.map((p, idx) => (
						<div key={idx} className="product">
							<div className="row">
								<div>
                                    <label>{t('name')}</label>
									<input value={p.name} onChange={e => setProductValue(idx, 'name', e.target.value)} placeholder="Product name" />
								</div>
								<div>
                                    <label>{t('sku')}</label>
									<input value={p.sku} onChange={e => setProductValue(idx, 'sku', e.target.value)} placeholder="SKU-001" />
								</div>
							</div>
                            <label>{t('description')}</label>
							<textarea value={p.description} onChange={e => setProductValue(idx, 'description', e.target.value)} rows={3} placeholder="Details" />
							<div className="row">
								<div>
                                    <label>{t('price')}</label>
									<input value={p.price} onChange={e => setProductValue(idx, 'price', e.target.value)} placeholder="0" type="number" min="0" step="0.01" />
								</div>
								<div>
                                    <label>{t('image')}</label>
									<input type="file" accept="image/*" onChange={e => setProductValue(idx, 'imageFile', e.target.files?.[0] || null)} />
								</div>
							</div>
							<div className="actions">
                                <button type="button" onClick={() => setProducts(prev => [...prev, emptyProduct()])}>{t('add_product')}</button>
								{products.length > 1 && (
                                    <button type="button" onClick={() => setProducts(prev => prev.slice(0, -1))} style={{ background: '#374151' }}>{t('remove_last')}</button>
								)}
							</div>
						</div>
					))}
				</div>

				<div style={{ height: 16 }} />
				{status.type === 'error' && <div className="error">{status.message}</div>}
				<div className="actions">
                    <button disabled={busy} onClick={submit}>{busy ? 'Submitting…' : t('submit')}</button>
				</div>
			</div>
		</div>
	);
}

