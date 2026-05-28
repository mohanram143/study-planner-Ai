import { db } from "./config";
import {
  doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp,
} from "firebase/firestore";

export const logStudySession = async (uid, { subject, minutes, date }) => {
  const ref = doc(db, "users", uid, "analytics", date);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const d = snap.data();
    await updateDoc(ref, {
      totalMinutes: (d.totalMinutes || 0) + minutes,
      sessions: (d.sessions || 0) + 1,
      subjects: { ...(d.subjects || {}), [subject]: ((d.subjects || {})[subject] || 0) + minutes },
    });
  } else {
    await setDoc(ref, {
      date,
      totalMinutes: minutes,
      sessions: 1,
      subjects: { [subject]: minutes },
      updatedAt: serverTimestamp(),
    });
  }
};

export const subscribeAnalytics = (uid, cb) => {
  const { collection, query, orderBy, limit } = require("firebase/firestore");
  // Simple approach — listen to last 30 days
  const col = collection(db, "users", uid, "analytics");
  return onSnapshot(col, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
};