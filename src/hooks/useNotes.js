import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  subscribeNotes,
  addNote,
  updateNote,
  deleteNote,
} from "../firebase/notes";

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeNotes(user.uid, (data) => {
      setNotes(
        data.sort(
          (a, b) =>
            (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)
        )
      );
      setLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  const add = async (data) => {
    if (!user) throw new Error("Not authenticated");
    return await addNote(user.uid, data);
  };

  const update = async (id, data) => {
    if (!user) throw new Error("Not authenticated");
    return await updateNote(user.uid, id, data);
  };

  const remove = async (id) => {
    if (!user) throw new Error("Not authenticated");
    return await deleteNote(user.uid, id);
  };

  return { notes, loading, add, update, remove };
}