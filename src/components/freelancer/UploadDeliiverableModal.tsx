import { Upload, X } from "lucide-react";
import { useProjectStore } from "../../store/ProjectStore";
import toast from "react-hot-toast";

interface modalProps {
    onClose: () => void;
    project_id: string
}

const UploadDeliiverableModal = ( { onClose, project_id }: modalProps ) => {

    const { deliverableFormData, setDeliverableFormData, deliverableLoading,  uploadDeliverable } = useProjectStore()
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
    
        setDeliverableFormData({
            [name]: type === "file" && e.target instanceof HTMLInputElement
                ? e.target.files?.[0] || null
                : value,
        });
    };

    const handleUploadDeliverable = async () => {
        if (!deliverableFormData.title?.trim()) return toast.error("Enter a Deliverable Title");
        if (!deliverableFormData.description?.trim()) return toast.error("Add a Description");
        if (!deliverableFormData.file) return toast.error("Choose a File to Upload");
        
        try {
            await uploadDeliverable(deliverableFormData, project_id)
            const err = useProjectStore.getState().error
            if (err) return toast.error(err)
            onClose()
        } catch (err) {
            console.error("Error in handleUploadDeliverable", err);
        }
    }

    return (
        <div onClick={onClose} className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" >
            <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg">Upload Deliverable</h3><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2" aria-label="Close" onClick={onClose} ><X className="w-4 h-4" /> </button></div>

                <form onSubmit={(e) => { e.preventDefault(); handleUploadDeliverable() }} className="space-y-3" >
                    <div>
                        <label className="text-sm font-semibold">Title</label>
                        <input className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm mt-1" placeholder="e.g. Homepage Design"  name="title" onChange={handleChange}
                    value={deliverableFormData.title} />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Description</label>
                        <textarea rows={3} className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm mt-1" placeholder="Describe what this deliverable contains"  name="description" onChange={handleChange}
                    value={deliverableFormData.description} />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Attach File</label>
                        <input accept=".pdf,.png,.jpg,.jpeg,.zip" type="file" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm mt-1 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold dark:file:bg-white/10 hover:cursor-pointer"  name="file" onChange={handleChange}
                      />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1" >Maximum file size: 10 MB</p>
                    </div>
                    <button disabled={deliverableLoading} type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full disabled:opacity-50 " ><Upload className="w-4 h-4" /> Upload Deliverable</button>
                </form>
            </div>

        </div>
    )
}

export default UploadDeliiverableModal