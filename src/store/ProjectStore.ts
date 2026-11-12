import { create } from "zustand"
import { supabase } from "../lib/supabase-client"
import { useAuthStore } from "./AuthStore"

export interface FormData {
    project_name: string;
    client_id: string
}

interface ProjectStore {
    isLoading: boolean
    error: string | null;
    formData: FormData
    createProject : (data: FormData) => Promise<void>
    setFormData: (data: Partial<FormData>) => void;
}

const initialFormData: FormData = {
    project_name: '',
    client_id: '',
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
    isLoading: false,
    formData: initialFormData, 
    error: null,

    createProject: async (data) => {
        set({ isLoading: true, error: null })
        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            const {error} = await supabase.from("projects").insert({
                freelancer_id : userId,
                client_id : data.client_id,
                name: data.project_name
            }) 
            if (error) {
                console.error("Failed to add project", error.message)
                set({error:error.message})
            }
        } catch (err: any) {
            console.error("🔴 createProject : failed", err.message)
        } finally {
            set({ isLoading: false });
        }

    },

    setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),

}))