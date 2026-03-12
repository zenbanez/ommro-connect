import { db } from './firebase';
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  getDocs, getDoc, query, orderBy, arrayUnion, arrayRemove, serverTimestamp 
} from 'firebase/firestore';

const EVENTS_COLLECTION = 'events';

/**
 * Fetch all events, ordered by date descending.
 */
export async function fetchEvents() {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetch a single event by ID.
 */
export async function fetchEventById(eventId) {
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Create a new event. Only officers/admins should call this.
 */
export async function createEvent(eventData) {
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...eventData,
    attendees: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing event. Only officers/admins should call this.
 */
export async function updateEvent(eventId, eventData) {
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  await updateDoc(docRef, {
    ...eventData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an event. Only admins should call this.
 */
export async function deleteEvent(eventId) {
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  await deleteDoc(docRef);
}

/**
 * Join an event (add current user's UID to the attendees array).
 */
export async function joinEvent(eventId, userId) {
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  await updateDoc(docRef, {
    attendees: arrayUnion(userId),
  });
}

/**
 * Leave an event (remove current user's UID from the attendees array).
 */
export async function leaveEvent(eventId, userId) {
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  await updateDoc(docRef, {
    attendees: arrayRemove(userId),
  });
}
