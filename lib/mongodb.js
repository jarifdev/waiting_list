import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
	const MONGODB_URI = process.env.MONGODB_URI;
	if (!MONGODB_URI) {
		throw new Error('Missing MONGODB_URI');
	}
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, {
			bufferCommands: false,
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

