import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, default: '' },
		price: { type: Number, default: 0 },
		sku: { type: String, default: '' },
		imageUrl: { type: String, default: '' },
		additional: { type: Schema.Types.Mixed },
	},
	{ _id: false }
);

const WaitlistEntrySchema = new Schema(
	{
		account: {
			email: { type: String, required: true, lowercase: true, trim: true },
			phone: { type: String, default: '', trim: true },
			countryCode: { type: String, default: '+968', trim: true },
			username: { type: String, required: true, trim: true },
			passwordHash: { type: String, required: true },
		},
		store: {
			storeName: { type: String, required: true, trim: true },
			crNumber: { type: String, required: true, trim: true },
		},
		products: { type: [ProductSchema], default: [] },
	},
	{ timestamps: true }
);

export default mongoose.models.WaitlistEntry || mongoose.model('WaitlistEntry', WaitlistEntrySchema);

