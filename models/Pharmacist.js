import mongoose from 'mongoose';

const PharmacistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  licenseNumber: { type: String },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.models.Pharmacist || mongoose.model('Pharmacist', PharmacistSchema);