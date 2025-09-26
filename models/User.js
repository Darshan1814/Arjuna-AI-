import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  provider: { type: String, default: 'credentials' },
  isDoctor: { type: Boolean, default: false },
  isPharmacist: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);