// AuthListener.tsx
import { useEffect } from "react";
import { supabase } from "../lib/supabase-client";
import { useAuthStore } from "../store/AuthStore";

export default function AuthListener() {
  const { fetchSession } = useAuthStore();

  useEffect(() => {
    // load the saved session once when the app starts
    fetchSession();

    // keep it updated on sign in, sign out, invite link and token refresh
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.setState({ session, isLoading: false });
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return null;
}