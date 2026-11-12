import { create } from "zustand"
import { supabase } from "../lib/supabase-client"
import { useAuthStore } from "./AuthStore"

export interface ClientFormData {
    name: string;
    email: string
}

interface ClientStore {
    isLoading: boolean
    error: string | null;
    clientFormData: ClientFormData
    inviteClient : (data: ClientFormData) => Promise<void>
    setFormData: (data: Partial<ClientFormData>) => void;

}

const initialFormData: ClientFormData = {
    name: '',
    email: '',
};

export const useClientStore = create<ClientStore>((set) => ({
    isLoading: false,
    clientFormData: initialFormData, 
    error: null,

    inviteClient: async (data) => {
        set({isLoading: true, error: null})
        const session = useAuthStore.getState().session
        const userId = session?.user.id
    
        try {
            const { error } = await supabase.from("clients").insert({
                freelancer_id: userId,
                name: data.name,
                email: data.email
            })
            if (error) {
                const msg = error.code === "23505" ? "You've already invited a client with this email." : error.code === "42501" ? "You don't have permission to do that." : "Couldn't invite client. Please try again."
                console.error("Failed to invite client:", error.message)
                set({ error: msg })
                return
            }
        } catch (err: any) {
            console.error("🔴 inviteClient : failed", err.message)
        } finally {
            set({ isLoading: false });
        }
    },

    setFormData: (data) => set((s) => ({ clientFormData: { ...s.clientFormData, ...data } })),

}))
