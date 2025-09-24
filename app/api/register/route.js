import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';			
import WaitlistEntry from '../../../models/WaitlistEntry';
import { hashPassword, sanitizeString, toNumber, validatePhone, validatePassword, validateCRNumber } from '../../../lib/security';

import { v2 as cloudinary } from 'cloudinary';

const hasCloudinary = Boolean(
	process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		secure: true,
	});
}

async function uploadImageFromBase64(dataUrl) {
	if (!hasCloudinary || !dataUrl) return '';
	try {
		const res = await cloudinary.uploader.upload(dataUrl, { folder: 'waitinglist-products' });
		return res.secure_url || '';
	} catch (e) {
		console.error('Cloudinary upload failed', e);
		return '';
	}
}

export async function POST(req) {
	try {
		const body = await req.json();

		const account = body.account || {};
		const store = body.store || {};
		let products = Array.isArray(body.products) ? body.products : [];

		// Basic validation
		if (!account.email || !account.username || !account.password || !store.storeName || !store.crNumber) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Field validation
		if (!validatePhone(account.phone)) {
			return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
		}
		if (!validatePassword(account.password)) {
			return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
		}
		if (!validateCRNumber(store.crNumber)) {
			return NextResponse.json({ error: 'CR number must be 10 digits' }, { status: 400 });
		}

		await connectToDatabase();

		// Handle logo and banner image uploads
		let logoUrl = '';
		let bannerUrl = '';
		if (body.__uploadedFiles) {
			if (body.__uploadedFiles.logoImage) {
				logoUrl = await uploadImageFromBase64(body.__uploadedFiles.logoImage);
			}
			if (body.__uploadedFiles.bannerImage) {
				bannerUrl = await uploadImageFromBase64(body.__uploadedFiles.bannerImage);
			}
		}

		const doc = await WaitlistEntry.create({
			account: {
				email: sanitizeString(account.email, 200),
				phone: sanitizeString(account.phone, 20),
				countryCode: sanitizeString(account.countryCode, 10),
				username: sanitizeString(account.username, 120),
				passwordHash: hashPassword(account.password),
			},
			store: {
				storeName: sanitizeString(store.storeName, 200),
				crNumber: sanitizeString(store.crNumber, 120),
			},
			products,
		});

		return NextResponse.json({ ok: true, id: doc._id });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
	}
}

