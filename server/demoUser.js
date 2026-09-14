// Demo user factory — shared by the server login route and the client's
// offline login fallback, so both produce identical demo sessions.

export function buildDemoUser(email, role = 'student') {
  return {
    _id: `user_demo_${role}_${Date.now()}`,
    fullName: email
      ? email.split('@')[0].toUpperCase()
      : role === 'landlord' ? 'Rajesh Kumar (Landlord)'
      : role === 'admin' ? 'System Administrator'
      : 'Aarav Sharma (Student)',
    email: email || `${role}@safestay.edu`,
    role,
    gender: role === 'landlord' ? 'Male' : 'Female',
    isVerifiedStudent: role === 'student',
    paidCommunityAccess: true,
    aiPreferences: {
      maxBudget: 8000,
      preferredGenderCategory: role === 'landlord' ? 'Co-ed / Unisex' : 'Female Only',
      needsGym: true,
      needsFoodMess: true,
      needsLibrary: true,
      preferredRadiusKm: 2.0,
    },
    emergencyContacts: [
      { name: 'Primary Guardian', phone: '+919876543210', relation: 'Parent' },
      { name: 'Safety Helpline', phone: '112', relation: 'Emergency Service' },
    ],
  };
}
