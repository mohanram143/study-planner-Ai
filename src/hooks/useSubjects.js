import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  subscribeSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../firebase/subjects";

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeSubjects(user.uid, (data) => {
      setSubjects(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  const add = async (data) => {
    if (!user) throw new Error("Not authenticated");
    return await addSubject(user.uid, data);
  };

  const update = async (id, data) => {
    if (!user) throw new Error("Not authenticated");
    return await updateSubject(user.uid, id, data);
  };

  const remove = async (id) => {
    if (!user) throw new Error("Not authenticated");
    return await deleteSubject(user.uid, id);
  };

  return { subjects, loading, add, update, remove };
}