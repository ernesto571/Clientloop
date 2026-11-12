import { create } from "zustand"
import { supabase } from "../lib/supabase-client"
import { useAuthStore } from "./AuthStore"

export interface Clients {
    id: string;
    name: string;
    email: string;
    status: string;
}

export interface ClientFormData {
    name: string;
    email: string
}

interface ClientStore {
    isLoading: boolean
    error: string | null;
    clients: Clients[];
    clientFormData: ClientFormData
    fetchClients: () => Promise<void>
    inviteClient : (data: ClientFormData) => Promise<void>
    setFormData: (data: Partial<ClientFormData>) => void;

}

const initialFormData: ClientFormData = {
    name: '',
    email: '',
};

export const useClientStore = create<ClientStore>((set, get) => ({
    isLoading: false,
    clients: [],
    clientFormData: initialFormData, 
    error: null,

    fetchClients: async () => {
        set({isLoading: true})
        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            const {data, error }= await supabase.from("clients").select("*").eq("freelancer_id", userId).order("created_at", { ascending: false } )
            if (error){
                console.log("Error fetching clients from database", error.message)
                set({isLoading: false})
                return
            }
            set ({clients: data})
        } catch (err: any) {
            console.error("🔴 fetchClients : failed", err.message)
        } finally {
            set({ isLoading: false });
        }

    },

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
            await get().fetchClients()
        } catch (err: any) {
            console.error("🔴 inviteClient : failed", err.message)
        } finally {
            set({ isLoading: false });
        }
    },

    setFormData: (data) => set((s) => ({ clientFormData: { ...s.clientFormData, ...data } })),

}))
