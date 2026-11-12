import { create } from "zustand"
import { supabase } from "../lib/supabase-client"
import { useAuthStore } from "./AuthStore"
import toast from "react-hot-toast";

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
    resendInvite: (clientId: string) => Promise<void>
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
        set({ isLoading: true, error: null })
        try {
            const { error } = await supabase.functions.invoke("invite-client", { body: { name: data.name, email: data.email } })
            if (error) {
                const body = await (error as any).context?.json?.().catch(() => null)
                set({ error: body?.error ?? "Couldn't invite client. Please try again." })
                return
            }

            await get().fetchClients()
        } catch (err: any) {
            console.error("🔴 inviteClient : failed", err.message)
        } finally {
            set({ isLoading: false });
        }
    },

    resendInvite: async (clientId) => {
        set({ isLoading: true })
        try {
            const { error } = await supabase.functions.invoke("invite-client", { body: { clientId } })
            if (error) {
                const body = await (error as any).context?.json?.().catch(() => null)
                toast.error(body?.error ?? "Couldn't resend the invite.")
                return
            }
            toast.success("Invite resent.")
        } catch (err: any) {
            console.error("🔴 resendInvite : failed", err.message)
        } finally {
            set({ isLoading: false })
        }
    },

    setFormData: (data) => set((s) => ({ clientFormData: { ...s.clientFormData, ...data } })),

}))
