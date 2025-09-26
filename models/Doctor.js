import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);