import { AlarmClock, ArrowUpRight, Ban, BellRing, CircleCheck, Send, Trash2 } from "lucide-react";
import { useAuthStore } from "../../store/AuthStore";
import InvoiceProgress from "./InvoiceProgress";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../lib/utils";
import { useInvoiceStore } from "../../store/InvoiceStore";
import toast from "react-hot-toast";

export interface Invoice {
    id: string;
    client_id: string;
    invoice_number: string;
    status: string;
    total: number;
    created_at: string;
    items: {
        id: string;
        description: string;
        unit_price: number;
    }[] ;
    client: {
        id: string;
        name: string;
        email: string;
    };
    project: {
        id: string;
        name:string;
    }
}

interface props {
    invoice : Invoice
}
const BADGE_STYLES: Record<string, string> = {
    Draft:     "bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-300",
    Sent:      "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    Overdue:   "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
    Paid:      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    Cancelled: "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400",
}

const AMOUNT_LABELS: Record<string, string> = {
    Draft:     "Draft total",
    Sent:      "Amount due",
    Overdue:   "Overdue · amount due",
    Paid:      "Amount paid",
    Cancelled: "Cancelled amount",
}

const InvoiceTab = ({invoice} : props) => {

    const navigate = useNavigate()
    const { invoiceLoading, updateInvoiceStatus, deleteInvoice} = useInvoiceStore()
    const session = useAuthStore.getState().session
    const userName = session?.user.user_metadata.full_name
    const userEmail = session?.user.email

    const handleClick = ( projectId: string ) => {
        navigate(`/projects/${projectId}`);
    };

    const handleStatusChange = async ( status: string, id: string ) => {
        
        try {
            await updateInvoiceStatus(status, id)
            const err = useInvoiceStore.getState().error
            if (err) return toast.error(err)
        } catch (err) {
            console.error("Error in handleStatusChange", err);
        }
    }

    return (
        <div className="min-w-0 hidden lg:block lg:sticky lg:top-20" >
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm !p-0 overflow-hidden" >
                <div className="p-5 border-b border-neutral-200 dark:border-white/10" >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Invoice</p>
                            <p className="text-xl font-extrabold tracking-tight mt-0.5">{invoice.invoice_number}</p>
                        </div>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${BADGE_STYLES[invoice.status]}`}>{invoice.status} </span>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-5">
                        {AMOUNT_LABELS[invoice.status]}
                    </p>
                    <p className={`text-4xl font-extrabold tracking-tight tabular-nums leading-tight ${invoice.status == "Cancelled" ? "line-through text-neutral-500 dark:text-neutral-400" : "" } `}>${invoice.total.toFixed(2)} </p>
                    <InvoiceProgress status={invoice.status} />
                </div>

                <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm border-b border-neutral-200 dark:border-white/10" >
                    <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">From</p><p className="font-semibold truncate">{userName} </p><p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{userEmail} </p></div>

                    <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">Bill To</p><p className="font-semibold truncate">{invoice.client.name} </p><p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{invoice.client.email} </p></div>

                    <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">Project</p><button className="font-semibold text-left hover:underline inline-flex items-center gap-1 max-w-full" onClick={() => handleClick(invoice.project.id) } ><span className="truncate">{invoice.project.name} </span><ArrowUpRight className="w-3.5 h-3.5" /> </button></div>

                    <div><p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">Issued</p><p className="font-semibold">{formatDate(invoice.created_at) } </p></div>

                </div>

                <div className="p-5">
                    <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pb-2 border-b border-neutral-200 dark:border-white/10" >
                        <span>Description</span><span>Unit Price</span>
                    </div>

                    { invoice.items.map((i) => (
                        <div key={i.id} className="flex justify-between gap-4 py-2.5 text-sm border-b border-dashed border-neutral-200 dark:border-white/10" >
                            <span className="min-w-0 break-words">{i.description}</span>
                            <span className="tabular-nums font-medium shrink-0">${i.unit_price.toFixed(2)} </span>
                        </div>
                    )) }

                    <div className="flex justify-between pt-3 font-extrabold"><span>Total</span><span>${invoice.total.toFixed(2)} </span></div>
                </div>

                { invoice.status === "Draft" && (
                    <div className="p-4 bg-neutral-50 dark:bg-white/[0.03] border-t border-neutral-200 dark:border-white/10 flex flex-wrap gap-2">
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition flex-1 disabled:opacity-50 " onClick={() => updateInvoiceStatus( "Sent",invoice.id)} disabled={invoiceLoading} ><Send className="w-4 h-4" /> Send Invoice</button>
                        <button onClick={() => deleteInvoice(invoice.id)} disabled={invoiceLoading}  className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10  py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2.5 disabled:opacity-50" title="Delete draft" aria-label="Delete draft " ><Trash2 className="w-4 h-4" /></button>
                    </div>
                ) }

                { invoice.status === "Sent" && (
                    <div className="p-4 bg-neutral-50 dark:bg-white/[0.03] border-t border-neutral-200 dark:border-white/10 flex flex-wrap gap-2">
                        <button disabled={invoiceLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition flex-1 disabled:opacity-50" onClick={() => handleStatusChange("Paid", invoice.id)} ><CircleCheck className="w-4 h-4" /> Mark as Paid</button>
                        <button disabled={invoiceLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition disabled:opacity-50" onClick={() => handleStatusChange("Overdue", invoice.id)} ><AlarmClock className="w-4 h-4" /> Overdue</button>
                        <button disabled={invoiceLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2.5 disabled:opacity-50" title="Cancel invoice" aria-label="Cancel invoice" onClick={() => handleStatusChange("Cancelled", invoice.id)} ><Ban className="w-4 h-4" /> </button>
                    </div>
                ) }

                { invoice.status === "Overdue" && (
                    
                    <div className="p-4 bg-neutral-50 dark:bg-white/[0.03] border-t border-neutral-200 dark:border-white/10 flex flex-wrap gap-2">
                        <button disabled={invoiceLoading} 
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition flex-1 disabled:opacity-50"
                        >
                            <BellRing className="h-4 w-4" />
                            Send Reminder
                        </button>

                        <button disabled={invoiceLoading} 
                            type="button"
                            onClick={() => updateInvoiceStatus(invoice.id, "Paid")}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition disabled:opacity-50"
                        >
                            <CircleCheck className="h-4 w-4" />
                            Paid
                        </button>

                        <button disabled={invoiceLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2.5 disabled:opacity-50" title="Cancel invoice" aria-label="Cancel invoice" onClick={() => handleStatusChange("Cancelled", invoice.id)} ><Ban className="w-4 h-4" /> </button>
                    </div>
                ) }
                
            </div>
        </div>
    )
}

export default InvoiceTab