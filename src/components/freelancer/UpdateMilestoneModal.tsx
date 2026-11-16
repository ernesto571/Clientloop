import { Check, X } from "lucide-react";
import { useProjectStore } from "../../store/ProjectStore";
import toast from "react-hot-toast";
import { useEffect } from "react";

export interface Milestone {
    id: string;
    title: string;
}

interface modalProps {
    onClose: () => void;
    milestone: Milestone;
    project_id: string;
}

const UpdateMilestoneModal = ({ onClose, milestone, project_id  }: modalProps) => {

    const { setMilestoneFormData, milestoneFormData, editMilestone, milestoneLoading } = useProjectStore()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement >) => {
        setMilestoneFormData({ [e.target.name]: e.target.value });
    };
    
    const handleEditMilestone = async () => {
        if (!milestoneFormData.title?.trim()) return toast.error("Milestone title is required.");
        
        try {
            await editMilestone(milestoneFormData, milestone.id, project_id)
            const err = useProjectStore.getState().error
            if (err) return toast.error(err)
            onClose()
        } catch (err) {
            console.error("Error in handleEditMilestone", err);
        }
    }

    useEffect(() => {
        setMilestoneFormData({
            title: milestone.title
        });
    }, [milestone.id, milestone.title, setMilestoneFormData]);

    return (
        <div onClick={onClose} className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" >
            <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Edit Milestone</h3><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2" aria-label="Close" onClick={onClose} ><X className="h-4 w-4" /> </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleEditMilestone(); }} className="space-y-3" >
                    <label className="block text-sm font-semibold">Milestone Name</label>
                    <input className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Enter milestone text" name="title" onChange={handleChange}
                    value={milestoneFormData.title} />

                    <button disabled={milestoneLoading}  type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full disabled:opacity-50 " ><Check className="w-4 h-4" /> Save Changes</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateMilestoneModal