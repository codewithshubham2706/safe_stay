import mongoose from 'mongoose';

const AreaSignalSchema = new mongoose.Schema({
  localityName: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [Lng, Lat]
  },
  streetLightingRating: { type: String, enum: ['Well-Lit Main Road', 'Dimly Lit', 'Dark Narrow Alley'], default: 'Well-Lit Main Road' },
  nightSafetyScore: { type: Number, min: 1, max: 5, default: 4 },
  monsoonWaterloggingRisk: { type: Boolean, default: false },
  nearestPoliceBeatKm: { type: Number, default: 0.5 },
  nearestHospitalKm: { type: Number, default: 1.0 }
});

AreaSignalSchema.index({ location: '2dsphere' });

export default mongoose.models.AreaSignal || mongoose.model('AreaSignal', AreaSignalSchema);
