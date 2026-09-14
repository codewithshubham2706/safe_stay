import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true, index: true },
  roomType: { type: String, required: true }, // e.g. Single Sharing, Double Sharing, Triple Sharing
  monthlyRent: { type: Number, required: true },
  securityDeposit: { type: Number, default: 0.0 },
  mealsIncluded: { type: Boolean, default: false },
  acAvailable: { type: Boolean, default: false },
  attachedWashroom: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  photos: [String]
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
