import { create } from "zustand"
import { supabase } from "../lib/supabase-client"
import { useAuthStore } from "./AuthStore"

export interface Projects {
    id: string;
    name: string;
    status: string;
    created_at: string;
    client: {
        id: string;
        name: string;
        email: string;
    } | null ;
}

export interface FormData {
    project_name: string;
    client_id: string
}

interface ProjectStore {
    isLoading: boolean
    error: string | null;
    formData: FormData;
    projects: Projects[]
    fetchProjects: () => Promise<void>
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
    projects: [],

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
    
        const session = useAuthStore.getState().session;
        const userId = session?.user.id;
    
        if (!userId) {
            set({
                isLoading: false,
                error: "User not authenticated",
            });
            return;
        }
    
        try {
            const { data, error } = await supabase
                .from("projects")
                .select(`
                    id,
                    name,
                    status,
                    created_at,
                    client:clients (
                        id,
                        name,
                        email
                    )
                `)
                .eq("freelancer_id", userId)
                .order("created_at", { ascending: false });
    
            if (error) {
                console.error("Error fetching projects:", error.message);
                set({ error: error.message });
                return;
            }
            console.log(data)
    
            // @ts-ignore
            set({ projects: data ?? [] });
            
        } catch (err: any) {
            console.error("fetchProjects failed:", err.message);
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

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
                return
            }

            await get().fetchProjects()
        } catch (err: any) {
            console.error("🔴 createProject : failed", err.message)
        } finally {
            set({ isLoading: false });
        }

    },

    setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),

}))