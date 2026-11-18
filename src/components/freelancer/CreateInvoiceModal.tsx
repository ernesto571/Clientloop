import { Plus, Send, User, X } from "lucide-react";
import { useProjectStore } from "../../store/ProjectStore";
import { useEffect, useState } from "react";
import { useInvoiceStore } from "../../store/InvoiceStore";
import toast from "react-hot-toast";

interface modalProps {
    onClose: () => void;
}

const CreateInvoiceModal = ({ onClose }: modalProps) => {

    const { projects, fetchProjects } = useProjectStore()
    const { invoiceFormData, invoiceLoading, setInvoiceFormData, addLineItem, updateLineItem, removeLineItem, saveAsDraft, createAndSend ,resetInvoiceForm } = useInvoiceStore()
    const [clientName, setClientName ] = useState("")
    const [projectId, setProjectId ] = useState("")
    const [clientId, setClientId ] = useState("")

    const total = invoiceFormData.items.reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0
    )

    // normal fields (project_id)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInvoiceFormData({ [e.target.name]: e.target.value });
    };

    // line item fields: same idea, plus the row id
    const handleItemChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        updateLineItem(id, name as "description" | "price", value)
    };

    const handleSaveAsDraft = async () => {
        if (!invoiceFormData.project_id?.trim()) return toast.error("Choose a Project");
        if (invoiceFormData.items.length == 0) return toast.error("Add at Least One Line Item");
        for (const [index, item] of invoiceFormData.items.entries()) {
            const line = index + 1
            const price = Number(item.price)
        
            if (!item.description.trim()) {
                return toast.error(`Line ${line}: add a description`)
            }
            if (item.price === "" || isNaN(price) || price <= 0) {
                return toast.error(`Line ${line}: enter a valid price`)
            }
        }
        
        try {
            await saveAsDraft(invoiceFormData, projectId, total, clientId)
            const err = useInvoiceStore.getState().error
            if (err) return toast.error(err)
            onClose()
            resetInvoiceForm()
        } catch (err) {
            console.error("Error in handleSaveAsDraft", err);
        }
    }

    const handleCreateAndSend = async () => {
        if (!invoiceFormData.project_id?.trim()) return toast.error("Choose a Project");
        if (invoiceFormData.items.length == 0) return toast.error("Add at Least One Line Item");
        for (const [index, item] of invoiceFormData.items.entries()) {
            const line = index + 1
            const price = Number(item.price)
        
            if (!item.description.trim()) {
                return toast.error(`Line ${line}: add a description`)
            }
            if (item.price === "" || isNaN(price) || price <= 0) {
                return toast.error(`Line ${line}: enter a valid price`)
            }
        }
        
        try {
            await createAndSend(invoiceFormData, projectId, total, clientId)
            const err = useInvoiceStore.getState().error
            if (err) return toast.error(err)
            onClose()
            resetInvoiceForm()
        } catch (err) {
            console.error("Error in handleCreateAndSend", err);
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <div onClick={onClose} className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" >
            <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Create Invoice</h3>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2" aria-label="Close" onClick={onClose}><X className="h-4 w-4" /> </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold">Project</label>
                        <select className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm mt-1" name="project_id" value={invoiceFormData.project_id} onChange={(e) => 
                        {
                            const option = e.target.selectedOptions[0]
                            setClientName(option.dataset.clientName ?? ""); 
                            setProjectId(option.value);
                            setClientId(option.dataset.clientId ?? "");
                            handleChange(e)
                        } }>
                            <option value="">--Select a project--</option>
                            { projects.map((p) => (
                                <option key={p.id}  value={p.id} data-client-id={p.client?.id} data-client-name={p.client?.name} >{p.name} </option>
                                
                            )) }
                            
                        </select>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Bill to <b className="text-neutral-900 dark:text-neutral-100">{clientName} </b></p>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-1.5"><span className="text-sm font-semibold">Line Items</span><span className="text-xs text-neutral-500 dark:text-neutral-400">Unit price (USD)</span></div>
                        
                        <div className="space-y-2" >
                        {invoiceFormData.items.map((item) => (
                            <div key={item.id} className="flex gap-2">
                            <input
                                placeholder="e.g.Homepage DDesign"
                                value={item.description}
                                name="description"
                                onChange={handleItemChange(item.id)}
                                className="d w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
                            />
                            <div className="relative w-32 shrink-0">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400 pointer-events-none">$</span>
                                <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                name="price"
                                value={item.price}
                                onChange={handleItemChange(item.id)}
                                className="a w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm !pl-6 tabular-nums"
                                />
                            </div>
                            
                            {invoiceFormData.items.length > 1 && (
                                <button className="h-9 w-9 shrink-0 self-center grid place-items-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" type="button" onClick={() => removeLineItem(item.id)}><X className="w-4 h-4" /> </button>
                            )}
                            </div>
                        ))}

                        <button className="mt-2 text-sm font-semibold text-emerald-700 dark:text-[#00ed64] inline-flex items-center gap-1.5" type="button" onClick={addLineItem}><Plus className="w-4 h-4" /> Add Line Item</button>
                        </div>

                        
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 dark:bg-white/5 px-4 py-3"><span className="text-sm font-semibold">Total</span><span className="text-2xl font-extrabold tabular-nums">${total.toFixed(2)} </span></div>

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleSaveAsDraft} disabled={invoiceLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition disabled:opacity-50" >Save as Draft
                        </button>
                        
                        <button  onClick={handleCreateAndSend} disabled={invoiceLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition disabled:opacity-50" ><Send className="w-4 h-4" /> Create &amp; Send</button></div>
                </div>
            </div>
        </div>
    )
}

export default CreateInvoiceModal