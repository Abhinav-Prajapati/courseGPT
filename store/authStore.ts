import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
}));

// Initialize the auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setUser(session.user);
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setUser(session.user);
  } else {
    useAuthStore.getState().setSession(null);
    useAuthStore.getState().setUser(null);
  }
});
