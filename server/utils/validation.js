// Registration validation — the single source of truth shared by the route and
// the contract tests.

export const ROLES = ['student', 'landlord', 'admin'];
export const GENDERS = ['Male', 'Female', 'Other'];

export function validateRegistration({ fullName, email, password, role, gender } = {}) {
  const errors = [];
  if (!fullName || String(fullName).trim().length < 2) errors.push('Full name is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) errors.push('A valid email is required.');
  if (!password || String(password).length < 6) errors.push('Password must be at least 6 characters.');
  if (!ROLES.includes(role)) errors.push('Invalid role selected.');
  if (!GENDERS.includes(gender)) errors.push('Please select a gender.');
  return errors;
}
