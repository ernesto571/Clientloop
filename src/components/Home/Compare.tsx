import { X, Check } from "lucide-react";

const rows = ["Feedback stays in one place", "Clients see live progress", "One-click approvals", "Pay from the same page", "Automatic activity log"]

export default function Compare () {

    return (
        <section id="compare" className="mx-auto max-w-6xl px-4 py-20" >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Why Freelancers Switch</h2>

            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 mt-8 overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_90px] sm:grid-cols-[1fr_140px_140px] px-4 py-3 text-sm font-bold border-b border-neutral-200 dark:border-white/10">
                    <span></span>
                    <span className="text-center text-neutral-500 dark:text-neutral-400">Email + Docs</span>
                    <span className="text-center">Clientloop</span>
                </div>
                {rows.map(r => (
                    <div key={r} className="grid grid-cols-[1fr_80px_90px] sm:grid-cols-[1fr_140px_140px] px-4 py-3 text-sm items-center border-b last:border-0 border-neutral-200 dark:border-white/10">
                        <span>{r}</span>
                        <span className="grid place-items-center"><X className="h-4 w-4 text-rose-500" /></span>
                        <span className="grid place-items-center"><Check className="h-4 w-4 text-emerald-600 dark:text-[#00ed64]" /></span>
                    </div>
                ))}
            </div>

        </section>
    )
}