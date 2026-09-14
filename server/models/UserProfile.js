import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['student', 'landlord', 'admin'], default: 'student' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  aiPreferences: {
    maxBudget: Number,
    preferredGenderCategory: String,
    needsGym: Boolean,
    needsFoodMess: Boolean,
    needsLibrary: Boolean,
    preferredRadiusKm: { type: Number, default: 2.0 }
  },
  isVerifiedStudent: { type: Boolean, default: false },
  paidCommunityAccess: { type: Boolean, default: false },
  emergencyContacts: [{ name: String, phone: String, relation: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);
