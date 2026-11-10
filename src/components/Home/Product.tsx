import { useState } from "react"
import { FolderKanban, CircleCheck, Receipt, Circle, Users, MessageSquare, Bell, Activity, Upload, ShieldCheck } from "lucide-react";

const tabs = [
    { id: "proj", icon: FolderKanban, title: "Track Projects", desc: "Milestones and status your clients can follow live." },
    { id: "appr", icon: CircleCheck, title: "Approve Work", desc: "Approve or request changes in one click." },
    { id: "inv", icon: Receipt, title: "Get Paid", desc: "Send an invoice and collect payment online." },
]

const features = [
    { icon: Users, title: "Client Invites", color: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" },
    { icon: MessageSquare, title: "Project Comments", color: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" },
    { icon: Bell, title: "Notifications", color: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
    { icon: Activity, title: "Activity Feed", color: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
    { icon: Upload, title: "File Deliverables", color: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
    { icon: ShieldCheck, title: "Private by Default", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
]

export default function Product () {

    const [ activeTab, setActiveTab ] = useState("proj")

    return (
        <section id="product" className="border-y border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/40" >
            <div className="mx-auto max-w-6xl px-4 py-20" >
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl">Everything Your Client Needs, Nothing They Don’t</h2>

                <div className="mt-10 grid md:grid-cols-2 gap-8 items-center" >
                    <div className="space-y-3" >
                        {tabs.map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full text-left flex gap-3 rounded-xl border p-4 transition ${activeTab === t.id ? "border-emerald-600 dark:border-[#00ed64] bg-white dark:bg-neutral-900" : "border-neutral-200 dark:border-white/10"}`}>
                                <span className="mt-0.5"><t.icon className="h-5 w-5" /></span>
                                <span>
                                    <b className="block">{t.title}</b>
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{t.desc}</span>
                                </span>
                            </button>
                        ))}
                        
                    </div>

                    <div className="rounded-xl bg-emerald-600/10 dark:bg-[#00ed64]/10 p-6 grid place-items-center min-h-[260px]" >
                        { activeTab === "proj" && (
                            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full">
                                <div className="flex justify-between">
                                    <b>Marketing Website</b>
                                    <span className="rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300">In Progress</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden my-2">
                                    <div className="h-full bg-emerald-600 dark:bg-[#00ed64]" style={{ width: "50%" }}></div>
                                </div>
                                <p className="flex items-center gap-2 text-sm py-1 text-neutral-500 dark:text-neutral-400"><CircleCheck className="h-4 w-4" />Brand Discovery</p>
                                <p className="flex items-center gap-2 text-sm py-1 text-neutral-500 dark:text-neutral-400"><CircleCheck className="h-4 w-4" />Homepage Design</p>
                                <p className="flex items-center gap-2 text-sm py-1 "><Circle className="h-4 w-4" />Build and QA</p>
                                <p className="flex items-center gap-2 text-sm py-1 "><Circle className="h-4 w-4" />Launch</p>
                            </div>
                        ) }
                        { activeTab === "appr" && (
                            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full" >
                                <div className="flex justify-between"><b>homepage-v2.fig</b><span className="rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">Pending</span></div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-3">Uploaded today. Waiting on Acme Solar.</p>
                                <div className="flex gap-2"><span className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition">Approve</span><span className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition">Request Changes</span></div>
                            </div>
                        ) }

                        { activeTab === "inv" && (
                            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full" >
                                <div className="flex justify-between"><b>INV-001 · $1,200</b><span className="rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300">Sent</span></div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-3">Homepage Design, Brand Kit</p>
                                <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition">Pay Now</span>
                            </div>
                        ) }
                        
                    </div>
                </div>

                <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {features.map(f => (
                        <div key={f.title} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5  flex items-center gap-3">
                            <span className={`h-9 w-9 rounded-lg grid place-items-center ${f.color}`}><f.icon className="h-4 w-4" /></span>
                            <b className="text-sm">{f.title}</b>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}