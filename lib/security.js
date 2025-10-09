import crypto from 'crypto';

const salt = process.env.PASSWORD_SALT || 'dev-salt';
export function toNumber(value, fallback = 0) {
	const n = Number(value);
	return isNaN(n) ? fallback : n;
  }
  

export function hashPassword(plain) {
	return crypto.createHmac('sha256', salt).update(String(plain)).digest('hex');
}

export function sanitizeString(str, max = 500) {
	return String(str || '').trim().slice(0, max);
}

export function validatePhone(phone) {
	const cleaned = String(phone || '').replace(/\D/g, '');
	return cleaned.length >=8 && cleaned.length <= 15;
}

export function validatePassword(password) {
	return String(password || '').length >= 8;
}

export function validateCRNumber(crNumber) {
	const cleaned = String(crNumber || '').replace(/\D/g, '');
	return cleaned.length <= 7;
}

