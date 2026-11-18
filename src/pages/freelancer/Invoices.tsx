import { useEffect,  useState } from "react"
import Sidebar from "../../components/freelancer/Sidebar"
import Topbar from "../../components/freelancer/Topbar"
import { Receipt, AlarmClock, CircleCheck, PencilLine, Plus, Send, Ban, type LucideIcon } from "lucide-react";
import CreateInvoiceModal from "../../components/freelancer/CreateInvoiceModal";
import { useInvoiceStore, type Invoice } from "../../store/InvoiceStore";
import { formatDate } from "../../lib/utils";
import InvoiceTab from "../../components/freelancer/InvoiceTab";

type InvoiceStatus = "Draft" | "Sent" | "Overdue" | "Paid" | "Cancelled"

const STATUS_STYLES: Record<InvoiceStatus, { icon: LucideIcon; className: string }> = {
    Draft: {
        icon: PencilLine,
        className: "bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-300",
    },
    Sent: {
        icon: Send,
        className: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    },
    Overdue: {
        icon: AlarmClock,
        className: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
    },
    Paid: {
        icon: CircleCheck,
        className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
    Cancelled: {
        icon: Ban,
        className: "bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400",
    },
}

const Invoices = () => {

    const { invoices, invoiceLoading, fetchInvoices } = useInvoiceStore()
    const [ modal, setModal] = useState("")
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const selectedInvoice = invoices.find((i) => i.id === selectedId) ?? invoices[0] ?? null

    const stats = [
    {
        label: "Outstanding",
        value: "$450.00",
        sub: "1 awaiting payment",
        icon: Receipt,
        iconClass: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    },
    {
        label: "Overdue",
        value: "$450.00",
        sub: "1 invoice",
        icon: AlarmClock,
        iconClass: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
        valueClass: "text-red-600 dark:text-red-400",
    },
    {
        label: "Paid",
        value: "$800.00",
        sub: "1 invoice",
        icon: CircleCheck,
        iconClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
    {
        label: "Drafts",
        value: "$2,400.00",
        sub: "1 ready to send",
        icon: PencilLine,
        iconClass: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    },
    ];
    const categories = [
        {label:"All", length:1},
        {label:"Draft", length: 2},
        {label:"Sent", length: 2},
        {label:"Overdue", length: 2},
        {label:"Paid", length: 2},
        {label:"Cancelled", length: 2},
        
    ]
    const [ activeCategory, setActiveCategory ] = useState("All");

    const filteredInvoices = invoices?.filter(
        (i) => activeCategory === "All" || i.status === activeCategory
    )

    useEffect(() => {
        fetchInvoices()
    }, [])

    return (
        <main>
            <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
                <Sidebar />

                <div className="min-w-0" >
                    <Topbar label={"Invoices"} />

                    <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-2xl font-extrabold tracking-tight">Invoices</h2>
                            <div className="flex gap-2">
                                <button  onClick={ () => setModal("new-inv")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition" ><Plus className="w-4 h-4" /> Create Invoice</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-200 dark:bg-white/10 shadow-sm mb-4" >
                            {stats.map(({ label, value, sub, icon: Icon, iconClass, valueClass = "" }) => (
                                <div key={label} className="bg-white dark:bg-neutral-900 p-4 sm:p-5 flex items-start gap-3 min-w-0">
                                <span className={`hidden sm:grid h-9 w-9 shrink-0 rounded-lg place-items-center ${iconClass}`}>
                                    <Icon className="w-4 h-4" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
                                    <p className={`text-lg sm:text-2xl font-extrabold leading-tight tabular-nums truncate ${valueClass}`}>
                                    {value}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{sub}</p>
                                </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 mb-3" >
                            { categories.map((c) => (
                                <button key={c.label} onClick={() => setActiveCategory(c.label)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold  ${ activeCategory === c.label ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]" : "border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-neutral-400" } `} >
                                    { c.label }
                                    <span className="opacity-70 pl-2">{c.length} </span>
                                </button>
                            )) }

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-4 items-start" >
                            <div className="min-w-0 " >
                                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm !p-0 overflow-hidden" >
                                    <div className="flex justify-between px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-white/10"><span>Invoice</span><span>Total · Issued</span></div>
                                    
                                    <div>
                                        { filteredInvoices.map((i) => {
                                            const { icon: Icon, className } = STATUS_STYLES[i.status as InvoiceStatus]
                                            return (
                                                <button onClick={() => setSelectedId(i.id)} key={i.id} className={`w-full text-left flex items-center gap-3 px-4 py-3.5 border-b last:border-0 border-neutral-200 dark:border-white/10 transition dark:hover:bg-white/[0.03] ${selectedInvoice === i ? " bg-emerald-50 dark:bg-[#00ed64]/[0.06] shadow-[inset_3px_0_0_#059669] dark:shadow-[inset_3px_0_0_#00ed64]" : " hover:bg-neutral-50"}`} >
                                                    <span className={`h-10 w-10 shrink-0 rounded-lg grid place-items-center ${className}`}>
                                                        <Icon className="h-4 w-4" />
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <b className="text-sm">{i.invoice_number}</b>
                                                            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${STATUS_STYLES[i.status as InvoiceStatus].className}`}>
                                                                {i.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{i.client.name} · {i.project.name} · {i.items.length} items</p>
                                                    </div>

                                                    <div className="text-right shrink-0"><p className="text-sm font-bold tabular-nums ">${i.total.toFixed(2)}</p><p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{formatDate(i.created_at)} </p></div>
                                                </button>
                                            )
                                            
                                        }) }
                                    </div>

                                </div>
                            </div>
                            <div>
                                {selectedInvoice && (
                                    <InvoiceTab 
                                        invoice={selectedInvoice} 
                                    />
                                )}
                            </div>
                        </div>

                    </main>
                </div>
            </div>
            
            { modal === "new-inv" && (
                <CreateInvoiceModal 
                    onClose={() => setModal("")}
                />
            ) }
            
        </main>
    )
}

export default Invoices