import { create } from "zustand"
import { supabase } from "../lib/supabase-client";
import toast from "react-hot-toast";
import type { Session } from "@supabase/supabase-js"

interface FormData {
    name?: string;
    email: string;
    password: string;
}

interface AuthStore {
    isLoading: boolean
    error: string | null;
    session: Session | null;
    formData: FormData
    signUp : (data: FormData) => Promise<void>
    login : (data: FormData) => Promise<void>
    googleSignIn: () => Promise<void>
    logout: () => Promise<void>
    fetchSession: () => Promise<void>
    setFormData: (data: Partial<FormData>) => void;
}

const initialFormData: FormData = {
    name: '',
    email: '',
    password: '',
};
  
export const useAuthStore = create<AuthStore>((set) => ({
    isLoading: false,
    formData: initialFormData, 
    error: null,
    session: null,

    signUp: async (data) => {
        set({isLoading: true})

        try {
            const { error } = await supabase.auth.signUp({
                email: data.email, password: data.password, 
                options: {
                    data: {
                      full_name: data.name,
                      role: "freelancer"
                    },
                }, 
            })
            if (error) {
                set({ error: error.message, isLoading: false });
                console.error(error.message)
                return;
            }
        } catch (err: any) {
            console.error("🔴 signUp : failed", err.message)
          } finally {
            set({ isLoading: false });
        }
            
    },

    login: async (data) => {
        set({isLoading: true})

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email, password: data.password, 
            })
            if (error) {
                set({ error: error.message, isLoading: false });
                console.error(error.message)
                return;
            }
            
        } catch (err: any) {
            console.error("🔴 signIn : failed", err.message)
          } finally {
            set({ isLoading: false });
        }
            
    },

    googleSignIn: async () => {
        set({ isLoading: true })
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: window.location.origin + "/overview" },
            })
            if (error) { toast.error(error.message) }
        } catch (err: any) {
            toast.error("Something went wrong. Please try again.")
            console.error("🔴 googleSignIn : failed", err.message)
        } finally {
            set({ isLoading: false })
        }
    },

    logout: async () => {
        set({ isLoading: true })
        try {
            const { error } = await supabase.auth.signOut()
            if (error) { toast.error(error.message) }
            toast.success("Signed out.")
        } catch (err: any) {
            toast.error("Something went wrong. Please try again.")
            console.error("🔴 logout : failed", err.message)
        } finally {
            set({ isLoading: false })
        }
    },

    fetchSession: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.error(error.message)
                return
            }
            set({ session })
        } catch (err: any) {
            console.error("Failed to get session", err.message)
        }
    },

    setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),

}))