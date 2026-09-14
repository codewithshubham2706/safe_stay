import mongoose from 'mongoose';

const LocalAmenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Gym', 'Mess / Tiffin', 'Grocery / Daily Shop', 'Library', 'Pharmacy / Medical'], 
    required: true,
    index: true 
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [Lng, Lat]
  },
  address: String,
  averageMonthlyCost: Number // e.g., gym fee or monthly mess rate
});

LocalAmenitySchema.index({ location: '2dsphere' });

export default mongoose.models.LocalAmenity || mongoose.model('LocalAmenity', LocalAmenitySchema);
