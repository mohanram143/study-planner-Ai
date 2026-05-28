import { db } from "./config";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp,
} from "firebase/firestore";

const col = (uid) => collection(db, "users", uid, "notes");

export const addNote = (uid, data) =>
  addDoc(col(uid), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

export const updateNote = (uid, id, data) =>
  updateDoc(doc(db, "users", uid, "notes", id), { ...data, updatedAt: serverTimestamp() });

export const deleteNote = (uid, id) =>
  deleteDoc(doc(db, "users", uid, "notes", id));

export const subscribeNotes = (uid, cb) =>
  onSnapshot(col(uid), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );