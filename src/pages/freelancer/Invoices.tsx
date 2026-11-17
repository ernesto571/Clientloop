import { useState } from "react"
import Sidebar from "../../components/freelancer/Sidebar"
import Topbar from "../../components/freelancer/Topbar"
import { Receipt, AlarmClock, CircleCheck, PencilLine, Plus } from "lucide-react";
import CreateInvoiceModal from "../../components/freelancer/CreateInvoiceModal";


const Invoices = () => {

    const [ modal, setModal] = useState("")

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