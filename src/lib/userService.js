import { db } from './firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';

/**
 * User role definitions:
 * - 'member'  : Default role. Can view content, join events, submit documents.
 * - 'officer' : Committee officers. Can create and edit events.
 * - 'admin'   : Board of Directors / System Admin. Full CRUD on everything.
 */
export const ROLES = {
  MEMBER: 'member',
  OFFICER: 'officer',
  ADMIN: 'admin',
};

/**
 * Role hierarchy for permission checks.
 */
const ROLE_HIERARCHY = {
  member: 0,
  officer: 1,
  admin: 2,
};

/**
 * Fetch the user's profile (including role) from Firestore.
 */
export async function fetchUserProfile(uid) {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() };
}

/**
 * Update a user's role. Only admins should call this.
 */
export async function updateUserRole(uid, newRole) {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, { role: newRole });
}

/**
 * Check if a user has at least the specified role level.
 */
export function hasRole(userProfile, requiredRole) {
  if (!userProfile || !userProfile.role) return false;
  return (ROLE_HIERARCHY[userProfile.role] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

/**
 * Convenience checks
 */
export function canCreateEvents(userProfile) {
  return hasRole(userProfile, ROLES.OFFICER);
}

export function canEditEvents(userProfile) {
  return hasRole(userProfile, ROLES.OFFICER);
}

export function canDeleteEvents(userProfile) {
  return hasRole(userProfile, ROLES.ADMIN);
}

export function isAdmin(userProfile) {
  return hasRole(userProfile, ROLES.ADMIN);
}

/**
 * Fetch all users from the users collection.
 */
export async function fetchAllUsers() {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
}

/**
 * Delete a user profile from Firestore. (Does NOT delete the Firebase Auth account.)
 */
export async function deleteUser(uid) {
  const docRef = doc(db, 'users', uid);
  await deleteDoc(docRef);
}
