import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { subscribeAllSessions, saveSession, updateSession, deleteSession } from "../firebase/schedule";

export function useSchedule() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeAllSessions(user.uid, data => {
      setSessions(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const add = (data) => user && saveSession(user.uid, data);
  const update = (id, data) => user && updateSession(user.uid, id, data);
  const remove = (id) => user && deleteSession(user.uid, id);

  return { sessions, loading, add, update, remove };
}