import { db } from "./config";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, where, onSnapshot, serverTimestamp,
} from "firebase/firestore";

const col = (uid) => collection(db, "users", uid, "subjects");

export const addSubject = (uid, data) =>
  addDoc(col(uid), { ...data, createdAt: serverTimestamp() });

export const updateSubject = (uid, id, data) =>
  updateDoc(doc(db, "users", uid, "subjects", id), data);

export const deleteSubject = (uid, id) =>
  deleteDoc(doc(db, "users", uid, "subjects", id));

export const subscribeSubjects = (uid, cb) =>
  onSnapshot(col(uid), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );