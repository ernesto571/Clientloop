import { X } from "lucide-react"
import { useClientStore } from "../../store/ClientStore";
import { useEffect } from "react";
import { useProjectStore } from "../../store/ProjectStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface modalProps {
    onClose: () => void;
}

const NewProjectModal = ({ onClose }: modalProps) => {
    const navigate = useNavigate()

    const { fetchClients, clients } = useClientStore()
    const { isLoading, formData, setFormData, createProject } = useProjectStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ [e.target.name]: e.target.value });
    };

    const handleCreateProject = async () => {
        if (!formData.project_name?.trim()) return toast.error("Project name is required.");
        if (!formData.client_id?.trim()) return toast.error("Choose a client for this project.");
        
        try {
            await createProject(formData)
            const err = useProjectStore.getState().error
            if (err) return toast.error(err)
            onClose()
            navigate("/clients")
        } catch (err) {
            console.error("Error in handleCreateProject", err);
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    return (
        <div onClick={onClose} className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" >
            <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">New Project</h3>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2" aria-label="Close" onClick={onClose}><X className="h-4 w-4" /> </button>
                </div>

                <div className="space-y-3">
                    <input className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Project Name" name="project_name" onChange={handleChange}
                    value={formData.project_name} />
                    <select className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" name="client_id" value={formData.client_id} onChange={handleChange}>
                        <option value="">--Select a client--</option>
                        { clients.map((c) => (
                            <option key={c.id}  value={c.id} >{c.name} </option>
                        )) }
                        
                    </select>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full disabled:opacity-50 " disabled={isLoading} onClick={handleCreateProject} >Create Project</button>
                </div>

            </div>
        </div>
    )
}

export default NewProjectModal