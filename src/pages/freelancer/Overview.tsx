import { Plus, Receipt, UserPlus, Users } from "lucide-react";
import Sidebar from "../../components/freelancer/Sidebar";
import Topbar from "../../components/freelancer/Topbar";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import InviteClientModal from "../../components/freelancer/InviteClientModal";
import NewProjectModal from "../../components/freelancer/NewProjectModal";

const activity = [
    "Marketing Website Redesign → Draft",
    "Marketing Website Redesign → In Review",
    "Mobile App MVP → In Progress",
    "Mobile App MVP → In Review",
    "Mobile App MVP → Completed",
    "Marketing Website Redesign → Draft",
]

const projects= [
    { title:"Marketing Website Redesign", client:"Acme Solar", status:"In Review", percent:50 },
    { title:"Mobile App MVP", client:"Nova Studio", status:"In Progress", percent:33 }
]

export default function Overview () {
    
    const [ modal, setModal] = useState("")

    const actions = [
        { icon: UserPlus, label: "Invite Client", onclick: () => {setModal("invite")} },
        { icon: Receipt, label: "New Invoice" },
        { icon: Users, label: "View Clients" },
    ]

    return (
        <main>
            <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
                <Sidebar />

                <div className="min-w-0" >
                    <Topbar label={"Overview"} />

                    <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-2xl font-extrabold tracking-tight">Overview</h2>
                            <div className="flex gap-2">
                                <button  onClick={ () => setModal("new-proj")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition" ><Plus className="w-4 h-4" /> New Project</button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-4" >
                            <div className="rounded-xl border h-fit border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm px-5 py-8 lg:col-span-8" >
                                <div className="flex flex-wrap items-end justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">Awaiting Payment</p>
                                        <p className="text-5xl font-extrabold tracking-tight leading-none mt-2">$0</p>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">0 unpaid invoices</p>
                                    </div>
                                    <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition" ><Receipt className="w-4 h-4" /> View Invoices</button>
                                </div>

                                <div className="mt-6 h-3 rounded-full overflow-hidden flex bg-neutral-200 dark:bg-white/10"><div className="bg-emerald-600 dark:bg-[#00ed64] h-full w-full "></div></div>

                                <div className="mt-4 grid sm:grid-cols-3 gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600 dark:bg-[#00ed64]"></span>
                                        <span className="text-neutral-500 dark:text-neutral-400">Paid</span>
                                        <b className="ml-auto">$2,000</b>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-amber-400"></span>
                                        <span className="text-neutral-500 dark:text-neutral-400">Sent</span>
                                        <b className="ml-auto">$0</b>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-neutral-400 dark:bg-neutral-500"></span>
                                        <span className="text-neutral-500 dark:text-neutral-400">Draft</span>
                                        <b className="ml-auto">$0</b>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 lg:col-span-8" >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h3 className="font-bold">Active Projects</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-md px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">1 awaiting review</span>
                                        <NavLink to="/projects" className="text-sm font-semibold underline">View All</NavLink>
                                    </div>
                                </div>

                                { projects.map((p) => (
                                    <button key={p.title} className="w-full text-left py-3 border-b last:border-0 border-neutral-200 dark:border-white/10" >
                                        <div className="flex justify-between gap-2">
                                            <b className="text-sm"> {p.title} </b>
                                            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${ p.status === "Draft" ? "bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-300" : ( p.status === "In Review" ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" : "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" ) } `}> {p.status}</span>

                                        </div>
                                        <div className="flex items-center gap-3"><div className="flex-1"><div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden my-2"><div className="h-full bg-emerald-600 dark:bg-[#00ed64]" style={{width : `${p.percent}%`}}></div></div></div><span className="text-xs text-neutral-500 dark:text-neutral-400"> {p.percent}%</span></div>

                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{p.client} </p>

                                    </button>
                                )) }

                            </div>

                            <div className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-span-2 space-y-4" >
                                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm !p-0 grid grid-cols-2 divide-x divide-neutral-200 dark:divide-white/10">
                                    <div className="p-4">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Projects</p>
                                        <p className="text-3xl font-extrabold leading-tight">2</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">in progress</p>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Clients</p>
                                        <p className="text-3xl font-extrabold leading-tight">2</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">1 active</p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5">
                                    <h3 className="font-bold mb-3">Quick Actions</h3>
                                    <div className="grid gap-2">
                                        {actions.map(a => (
                                            <button onClick={a.onclick} key={a.label} className="inline-flex items-center justify-start gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition ">
                                                <a.icon className="h-4 w-4" />{a.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5">
                                    <h3 className="font-bold mb-3">Recent Activity</h3>
                                    <div className="border-l border-neutral-200 dark:border-white/10 ml-1.5 space-y-4">
                                        {activity.slice(0, 5).map((a, i) => (
                                            <p key={i} className="relative pl-4 text-sm">
                                                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-[#00ed64]"></span>{a}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        
                    </main>
                </div>
            </div>
            { modal === "invite" && (
                <InviteClientModal 
                    onClose={() => setModal("")}
                />
            ) }
            { modal === "new-proj" && (
                <NewProjectModal 
                    onClose={() => setModal("")}
                />
            ) }
        </main>
    )
}