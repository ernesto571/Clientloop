import { create } from "zustand"
import { supabase } from "../lib/supabase-client";
import toast from "react-hot-toast";
import type { Session } from "@supabase/supabase-js"

interface FormData {
    name?: string;
    email: string;
    password: string;
}

export interface AcceptInviteFormData {
    email: string;
    password: string;
    confirm: string;
}

interface AuthStore {
    acceptInviteFormData: any;
    isLoading: boolean
    error: string | null;
    session: Session | null;
    formData: FormData
    signUp : (data: FormData) => Promise<void>
    login : (data: FormData) => Promise<void>
    googleSignIn: () => Promise<void>
    acceptInvite : (data: AcceptInviteFormData) => Promise<boolean>
    fetchSession: () => Promise<void>
    setFormData: (data: Partial<FormData>) => void;
    setAcceptInviteFormData: (data: Partial<AcceptInviteFormData>) => void;
}

const initialFormData: FormData = {
    name: '',
    email: '',
    password: '',
};

const initialAccept: AcceptInviteFormData = {
    email: '',
    password: '',
    confirm: ''
};
  
export const useAuthStore = create<AuthStore>((set) => ({
    isLoading: false,
    formData: initialFormData, 
    acceptInviteFormData: initialAccept,
    error: null,
    session: null,

    signUp: async (data) => {
        set({isLoading: true, error: null })

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
        set({isLoading: true , error: null})

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

    acceptInvite: async (data) => {
        set({ isLoading: true, error: null })
    
        try {
            if (data.password !== data.confirm) {
                set({ error: "Passwords don’t match" })
                return false
            }
    
            // the invite link already signed them in
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                set({ error: "This invite link has expired. Ask your freelancer to resend it." })
                return false
            }
    
            // the email they typed must be the one that was invited
            if (session.user.email?.toLowerCase() !== data.email.trim().toLowerCase()) {
                set({ error: "This isn’t the email you were invited with." })
                return false
            }
    
            // save their password
            const { error } = await supabase.auth.updateUser({ password: data.password })
            if (error) {
                set({ error: error.message })
                console.error(error.message)
                return false
            }
    
            // mark the client as joined
            const { error: clientError } = await supabase
                .from("clients")
                .update({ status: "Active" })
                .eq("user_id", session.user.id)
    
            if (clientError) console.error("Failed to mark client active", clientError.message)
    
            return true
        } catch (err: any) {
            console.error("🔴 acceptInvite : failed", err.message)
            set({ error: err.message })
            return false
        } finally {
            set({ isLoading: false })
        }
    },

    fetchSession: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.error(error.message)
                set({ session: null })
                return
            }
            set({ session })
        } catch (err: any) {
            console.error("Failed to get session", err.message)
            set({ session: null })
        } finally {
            set({ isLoading: false })
        }
    },

    setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
    setAcceptInviteFormData: (data) => set((s) => ({ acceptInviteFormData: { ...s.acceptInviteFormData, ...data } }))

}))