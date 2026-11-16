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

export interface Deliverable {
    id: string;
    title: string;
    description: string;
    file_name: string;
    file_path: string;
    status: string;
    client_feedback: string;
}

export interface FormData {
    project_name: string;
    client_id: string
}

export interface MilestoneFormData {
    title: string
}

export interface DeliverableFormData {
    title: string;
    description: string;
    file: File | null
}

interface ProjectStore {
    isLoading: boolean
    milestoneLoading: boolean
    deliverableLoading: boolean
    error: string | null;
    formData: FormData;
    milestoneFormData: MilestoneFormData;
    deliverableFormData: DeliverableFormData
    projects: Projects[]
    milestones: Milestone[]
    deliverables: Deliverable[]
    fetchProjects: () => Promise<void>
    createProject : (data: FormData) => Promise<void>
    fetchMilestones: (id: string) => Promise<void>
    addMilestone : (data: MilestoneFormData, project_id: string)=> Promise<void>
    editMilestone : (data: MilestoneFormData, milestone_id: string, project_id: string )=> Promise<void>
    deleteMilestone: (id: string, project_id: string) => Promise<void>
    updateProjectStatus : (status: string , id: string | undefined) => Promise<void>
    updateMilestoneStatus: ( milestoone_id: string, project_id: string, status: boolean ) => Promise<void>
    uploadDeliverable: ( data: DeliverableFormData, project_id: string ) => Promise<void>
    downloadDeliverable: ( file_path: string, file_name: string ) => Promise<void>
    deleteDeliverable: (id: string, file_path: string, project_id: string) => Promise<void>;
    setFormData: (data: Partial<FormData>) => void;
    fetchDeliverables: (id: string) => Promise<void>;
    setMilestoneFormData: (data: Partial<MilestoneFormData>) => void;
    setDeliverableFormData: (data: Partial<DeliverableFormData>) => void;
}

const initialFormData: FormData = {
    project_name: '',
    client_id: '',
};

const initialMilestoneFormData: MilestoneFormData = {
    title: '',
};

const initialDeliverableFormData: DeliverableFormData = {
    title: "",
    description: "",
    file: null
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    isLoading: false,
    milestoneLoading: false,
    deliverableLoading: false,
    formData: initialFormData,
    milestoneFormData: initialMilestoneFormData,
    deliverableFormData: initialDeliverableFormData,
    error: null,
    projects: [],
    milestones: [],
    deliverables: [],

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

    editMilestone : async(data , milestoneId, project_id) => {
        set({ milestoneLoading: true, error: null })

        try {
            const {error} = await supabase.from("milestones").update({
                title: data.title
            }).eq("id", milestoneId) 
            if (error) {
                console.error("Failed to edit miilestone", error.message)
                set({error:error.message})
                return
            }

            await get().fetchMilestones(project_id) 

        } catch (err: any) {
            console.error("🔴 editMilestone : failed", err.message)
        } finally {
            set({ milestoneLoading: false, milestoneFormData : {
                title: ""
            } });
        }
    },

    deleteMilestone: async(id, project_id) => {
        set({ milestoneLoading: true, error: null })

        try {
            const {error} = await supabase.from("milestones").delete().eq("id", id) 
            if (error) {
                console.error("Failed to delete miilestone", error.message)
                set({error:error.message})
                return
            }

            await get().fetchMilestones(project_id) 

        } catch (err: any) {
            console.error("🔴 deleteMilestone : failed", err.message)
        } finally {
            set({ milestoneLoading: false });
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

    fetchDeliverables: async(id) => {
        set({ deliverableLoading: true, error: null })

        try {
            const { data, error } = await supabase.from("deliverables").select("*").eq("project_id", id).order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching deliverables:", error.message);
                set({ error: error.message });
                return;
            }
            console.log(data)
    
            set({ deliverables: data });
        } catch (err: any) {
            console.error("fetchMilestones failed:", err.message);
            set({ error: err.message });
        } finally {
            set({ deliverableLoading: false });
        }
    },

    uploadDeliverable: async (data, project_id) => {
        set({ deliverableLoading: true, error: null })
    
        try {
            const file = data.file

            const safeFileName = file?.name
            .normalize("NFKD")
            .replace(/[^\w.-]/g, "_")

            const filePath = `${project_id}/${crypto.randomUUID()}-${safeFileName}`
    
            const { error: uploadError } = await supabase.storage
                .from("deliverables")
                .upload(filePath, file, {
                    contentType: file?.type,
                    upsert: false
                })
    
            if (uploadError) {
                console.error("Failed to upload deliverable", uploadError.message)
                set({ error: uploadError.message })
                return
            }
    
            // 2. Insert deliverable details into database
            const { error: insertError } = await supabase
                .from("deliverables")
                .insert({
                    project_id: project_id,
                    title: data.title,
                    description: data.description,
                    file_name: file?.name,
                    file_path: filePath,
                    status: "Pending"
                })
    
            if (insertError) {
                console.error("Failed to insert deliverable", insertError.message)
                set({ error: insertError.message })
                return
            }
    
            // 3. Refresh deliverables
            await get().fetchDeliverables(project_id)
            set({deliverableFormData: {
                title: "",
                description: "",
                file: null
            }})
    
        } catch (err: any) {
            console.error("🔴 uploadDeliverable : failed", err.message)
            set({ error: err.message })
        } finally {
            set({
                deliverableLoading: false,
            })
        }
    },

    downloadDeliverable: async (file_path, file_name) => {
        set({ deliverableLoading: true, error: null })

        try {
            const { data, error } = await supabase.storage
                .from("deliverables")
                .download(file_path)
    
            if (error) {
                console.error("Failed to download deliverable", error.message)
                set({ error: error.message })
                return
            }
    
            const url = URL.createObjectURL(data)
    
            const link = document.createElement("a")
            link.href = url
            link.download = file_name
            document.body.appendChild(link)
            link.click()
            link.remove()
    
            URL.revokeObjectURL(url)
    
        } catch (err: any) {
            console.error("Download failed:", err.message)
        } finally {
            set({
                deliverableLoading: false,
            })
        }
    },

    deleteDeliverable: async (id, file_path, project_id) => {
        set({ deliverableLoading: true, error: null })
    
        try {
            // 1. Delete file from Storage
            const { error: storageError } = await supabase.storage
                .from("deliverables")
                .remove([file_path])
    
            if (storageError) {
                console.error("Failed to delete deliverable file:", storageError.message)
                set({ error: storageError.message })
                toast.error(storageError.message)
                return
            }
    
            // 2. Delete deliverable record
            const { error: deleteError } = await supabase
                .from("deliverables")
                .delete()
                .eq("id", id)
                .eq("project_id", project_id)
    
            if (deleteError) {
                console.error("Failed to delete deliverable:", deleteError.message)
                set({ error: deleteError.message })
                toast.error(deleteError.message)
                return
            }
    
            // 3. Refresh deliverables
            await get().fetchDeliverables(project_id)
    
            toast.success("Deliverable deleted successfully")
    
        } catch (err: any) {
            console.error("deleteDeliverable failed:", err.message)
            set({ error: err.message })
            toast.error(err.message)
        } finally {
            set({ deliverableLoading: false })
        }
    },

    setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),

    setMilestoneFormData: (data) => set((s) => ({ milestoneFormData: { ...s.milestoneFormData, ...data } })),

    setDeliverableFormData: (data) => set((s) => ({ deliverableFormData: { ...s.deliverableFormData, ...data } }))

}))