import { create } from "zustand"
import { supabase } from "../lib/supabase-client"
import { useAuthStore } from "./AuthStore"
import toast from "react-hot-toast";

export interface Milestone {
    id: string;
    title: string;
    is_completed: boolean;
}

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

export interface MilestoneFormData {
    title: string
}

interface ProjectStore {
    isLoading: boolean
    milestoneLoading: boolean
    error: string | null;
    formData: FormData;
    milestoneFormData: MilestoneFormData;
    projects: Projects[]
    milestones: Milestone[]
    fetchProjects: () => Promise<void>
    createProject : (data: FormData) => Promise<void>
    fetchMilestones: (id: string) => Promise<void>
    addMilestone : (data: MilestoneFormData, project_id: string)=> Promise<void>
    updateProjectStatus : (status: string , id: string | undefined) => Promise<void>
    updateMilestoneStatus: ( milestoone_id: string, project_id: string, status: boolean ) => Promise<void>
    setFormData: (data: Partial<FormData>) => void;
    setMilestoneFormData: (data: Partial<MilestoneFormData>) => void;
}

const initialFormData: FormData = {
    project_name: '',
    client_id: '',
};

const initialMilestoneFormData: MilestoneFormData = {
    title: '',
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
    isLoading: false,
    milestoneLoading: false,
    formData: initialFormData,
    milestoneFormData: initialMilestoneFormData,
    error: null,
    projects: [],
    milestones: [],

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

    updateProjectStatus : async (status, id) => {
        set({ isLoading: true, error: null })
        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            const {error} = await supabase.from("projects").update({
                status : status,
            }).eq("id", id).eq("freelancer_id", userId)
            if (error) {
                console.error("Failed to update project status", error.message)
                set({error:error.message})
                return
            }
            await get().fetchProjects() 
        } catch (err: any) {
            console.error("🔴 updateProjectStatus : failed", err.message)
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMilestones: async(id) => {
        set({ milestoneLoading: true, error: null })

        try {
            const { data, error } = await supabase.from("milestones").select("*").eq("project_id", id).order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching projects:", error.message);
                set({ error: error.message });
                return;
            }
            console.log(data)
    
            set({ milestones: data });
        } catch (err: any) {
            console.error("fetchMilestones failed:", err.message);
            set({ error: err.message });
        } finally {
            set({ milestoneLoading: false });
        }
    },

    addMilestone : async(data , project_id) => {
        set({ milestoneLoading: true, error: null })

        try {
            const {error} = await supabase.from("milestones").insert({
                project_id : project_id,
                title: data.title
            }) 
            if (error) {
                console.error("Failed to add project", error.message)
                set({error:error.message})
                return
            }

            await get().fetchMilestones(project_id) 

        } catch (err: any) {
            console.error("🔴 createProject : failed", err.message)
        } finally {
            set({ milestoneLoading: false, milestoneFormData : {
                title: ""
            } });
        }
    },


    updateMilestoneStatus: async (milestone_id, project_id, status) => {
        set({ milestoneLoading: true, error: null })

        try {
            const {data,error} = await supabase.from("milestones").update({
                is_completed : status,
            }).eq("id", milestone_id).select()
            if (error) {
                console.error("Failed to update milestone status", error.message)
                set({error:error.message})
                toast(error.message)
                return
            }
            console.log(data)
            await get().fetchMilestones(project_id) 
        } catch (err: any) {
            console.error("🔴 updateMilestoneStatus : failed", err.message)
        } finally {
            set({ milestoneLoading: false });
        }
    },

    setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),

    setMilestoneFormData: (data) => set((s) => ({ milestoneFormData: { ...s.milestoneFormData, ...data } }))

}))