import mongoose from 'mongoose';

const StructuralAuditSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  constructionDecade: { type: String, enum: ['<1990', '1990-2005', '2006-2018', '>2018'], required: true },
  structureType: { type: String, default: 'RCC Framed' },
  floorsBuilt: { type: Number, required: true },
  floorsPermitted: { type: Number, required: true },
  basementUsage: { type: String, enum: ['None', 'Storage/Parking', 'Student Rooms/Library'], required: true },
  emergencyExitsCount: { type: Number, default: 1 },
  openWiringHazard: { type: Boolean, default: false },
  structuralCracks: { type: Boolean, default: false },
  waterSeepageCeilingWalls: { type: Boolean, default: false },
  dampnessMoldInRooms: { type: Boolean, default: false },
  unrepairedPlumbingIssues: { type: Boolean, default: false },
  neglectedSewageHygiene: { type: Boolean, default: false },
  fireExtinguishersExpiredOrMissing: { type: Boolean, default: false },
  depositReturnedStatus: { 
    type: String, 
    enum: ['Returned Full', 'Unfair Deductions', 'Refused Refund', 'Current Resident'] 
  },
  overallRating: { type: Number, min: 1, max: 5 },
  pros: String,
  cons: String,
  renterAdvice: String,
  evidencePhotos: [{
    url: { type: String, required: true },
    tag: { 
      type: String, 
      enum: ['Highlight / Positive', 'Structural Defect / Warning', 'Neglected Maintenance / Decay'], 
      required: true 
    }
  }],
  isVerifiedResident: { type: Boolean, default: false }
}, { timestamps: true });

StructuralAuditSchema.index({ hostelId: 1, userId: 1 }, { unique: true });

export default mongoose.models.StructuralAudit || mongoose.model('StructuralAudit', StructuralAuditSchema);
