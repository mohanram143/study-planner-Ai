import { db } from "./config";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, setDoc,
} from "firebase/firestore";

const col = (uid) => collection(db, "users", uid, "schedule");

export const saveSchedule = (uid, sessions) =>
  setDoc(doc(db, "users", uid, "meta", "schedule"), {
    sessions,
    updatedAt: serverTimestamp(),
  });

export const subscribeSchedule = (uid, cb) =>
  onSnapshot(doc(db, "users", uid, "meta", "schedule"), snap => {
    if (snap.exists()) cb(snap.data().sessions || []);
    else cb([]);
  });

export const saveSession = (uid, data) =>
  addDoc(col(uid), { ...data, createdAt: serverTimestamp() });

export const updateSession = (uid, id, data) =>
  updateDoc(doc(db, "users", uid, "schedule", id), data);

export const deleteSession = (uid, id) =>
  deleteDoc(doc(db, "users", uid, "schedule", id));

export const subscribeAllSessions = (uid, cb) =>
  onSnapshot(col(uid), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );