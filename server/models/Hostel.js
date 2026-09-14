import mongoose from 'mongoose';

const HostelSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  aliasNames: [String],
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  pgGenderCategory: { 
    type: String, 
    enum: ['Female Only', 'Male Only', 'Co-ed / Unisex'], 
    required: true, 
    index: true 
  },
  owner: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    aiVerificationStatus: { 
      type: String, 
      enum: ['Unverified', 'Pending_AI_Audit', 'AI_Verified', 'Rejected'], 
      default: 'Unverified',
      index: true
    }
  },
  sviScore: { type: Number, default: 10.0, index: true }, // Structural Vulnerability (0-100)
  sviGrade: { type: String, default: 'Grade A (Sound)' },
  maintenanceDecayScore: { type: Number, default: 0.0, index: true }, // Maintenance Neglect (0-100)
  isCriticallyNeglected: { type: Boolean, default: false, index: true },
  depositRiskRating: { 
    type: String, 
    enum: ['Safe / Fully Refunded', 'Unfair Deductions Reported', 'High Non-Refund Risk'], 
    default: 'Safe / Fully Refunded' 
  },
  monsoonFloodProne: { type: Boolean, default: false },
  electricityRatePerUnit: { type: Number, default: 8.0 },
  coverImage: { type: String },
  cachedMinRent: { type: Number, default: 0.0, index: true }
}, { timestamps: true });

HostelSchema.index({ location: '2dsphere' });
HostelSchema.index({ pgGenderCategory: 1, sviScore: 1, cachedMinRent: 1 });

export default mongoose.models.Hostel || mongoose.model('Hostel', HostelSchema);
