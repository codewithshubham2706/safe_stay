import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import UserProfile from './models/UserProfile.js';
import LocalAmenity from './models/LocalAmenity.js';
import Hostel from './models/Hostel.js';
import Room from './models/Room.js';
import StructuralAudit from './models/StructuralAudit.js';
import AreaSignal from './models/AreaSignal.js';
import { SEED_HOSTELS, SEED_ROOMS, SEED_AMENITIES, SEED_AREA_SIGNALS, SEED_STRUCTURAL_AUDITS } from './seedData.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/safestay';

async function runSeed() {
  try {
    console.log('Connecting to MongoDB for seeding:', MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB.');

    // Clear existing collections
    await UserProfile.deleteMany({});
    await LocalAmenity.deleteMany({});
    await Hostel.deleteMany({});
    await Room.deleteMany({});
    await StructuralAudit.deleteMany({});
    await AreaSignal.deleteMany({});

    console.log('Cleared existing collections.');

    // Create sample users
    const defaultPasswordHash = await bcrypt.hash('Student123!', 10);

    const studentUser = await UserProfile.create({
      fullName: 'Aarav Sharma',
      email: 'aarav@student.edu',
      passwordHash: defaultPasswordHash,
      phone: '+919876543210',
      role: 'student',
      gender: 'Male',
      aiPreferences: {
        maxBudget: 8000,
        preferredGenderCategory: 'Male Only',
        needsGym: true,
        needsFoodMess: true,
        needsLibrary: true,
        preferredRadiusKm: 2.0
      },
      isVerifiedStudent: true,
      paidCommunityAccess: true,
      emergencyContacts: [
        { name: 'Ramesh Sharma (Father)', phone: '+919811122233', relation: 'Father' },
        { name: 'Hostel Caretaker', phone: '+919829012345', relation: 'Caretaker' }
      ]
    });

    const landlordUser = await UserProfile.create({
      fullName: 'Rajesh Kumar Sharma',
      email: 'rajesh@landlord.com',
      passwordHash: defaultPasswordHash,
      phone: '+919829012345',
      role: 'landlord',
      gender: 'Male',
      isVerifiedStudent: false,
      paidCommunityAccess: false
    });

    console.log(`Created default Users: Student (${studentUser.email}) and Landlord (${landlordUser.email})`);

    // Insert Hostels
    const hostelsWithIds = SEED_HOSTELS.map(h => ({
      ...h,
      owner: {
        ...h.owner,
        id: landlordUser._id
      }
    }));

    const insertedHostels = await Hostel.insertMany(hostelsWithIds);
    console.log(`Inserted ${insertedHostels.length} hostels.`);

    // Map hostel names/ids for room insertion
    const hostelMap = {};
    insertedHostels.forEach(h => {
      hostelMap[h.name] = h._id;
    });

    // Insert Rooms
    const roomsToInsert = SEED_ROOMS.map(r => {
      // Find matching hostel by id or index
      const matchingHostel = insertedHostels.find(h => h.coverImage && h._id.toString().includes(r.hostelId)) || insertedHostels[0];
      return {
        ...r,
        hostelId: matchingHostel._id
      };
    });
    await Room.insertMany(roomsToInsert);
    console.log(`Inserted ${roomsToInsert.length} rooms.`);

    // Insert Amenities & Signals
    await LocalAmenity.insertMany(SEED_AMENITIES.map(a => {
      const { _id, ...rest } = a;
      return rest;
    }));
    console.log(`Inserted ${SEED_AMENITIES.length} local amenities.`);

    await AreaSignal.insertMany(SEED_AREA_SIGNALS);
    console.log(`Inserted ${SEED_AREA_SIGNALS.length} area safety signals.`);

    // Insert Audits
    const auditsToInsert = SEED_STRUCTURAL_AUDITS.map(a => {
      const { _id, ...rest } = a;
      return {
        ...rest,
        hostelId: insertedHostels[0]._id,
        userId: studentUser._id
      };
    });
    await StructuralAudit.insertMany(auditsToInsert);
    console.log(`Inserted ${auditsToInsert.length} structural audits.`);

    console.log('🎉 DB Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during DB seeding:', error.message);
    process.exit(1);
  }
}

runSeed();
