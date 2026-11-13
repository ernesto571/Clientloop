import { useEffect, useState } from "react"
import NewProjectModal from "../../components/freelancer/NewProjectModal"
import Sidebar from "../../components/freelancer/Sidebar"
import Topbar from "../../components/freelancer/Topbar"
import { FolderKanban, ListTodo, Plus } from "lucide-react"
import { useProjectStore } from "../../store/ProjectStore"

const Projects = () => {

    const [ modal, setModal] = useState("")
    const { projects, isLoading,  fetchProjects } = useProjectStore()

    const draft_projects = projects?.filter(
        (p) => p.status === "Draft"
    )

    const review_projects = projects?.filter(
        (p) => p.status === "In Review"
    )

    const progress_projects = projects?.filter(
        (p) => p.status === "In Progress"
    )

    const complete_projects = projects?.filter(
        (p) => p.status === "Completed"
    )

    useEffect(() => {
        fetchProjects()
    }, [] )

    return (
        <main>
        <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
            <Sidebar />

            <div className="min-w-0" >
                <Topbar label={"Overview"} />

                <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h2 className="text-2xl font-extrabold tracking-tight">Projects</h2>
                        <div className="flex gap-2">
                            <button  onClick={ () => setModal("new-proj")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition" ><Plus className="w-4 h-4" /> New Project</button>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start" >
                        {/* draft */}
                        <div>
                            <div className="flex items-center gap-2 mb-3"><span className="h-2.5 w-2.5 rounded-full bg-neutral-400"></span><h3 className="text-sm font-bold">Draft</h3><span className="text-xs text-neutral-500 dark:text-neutral-400">{draft_projects.length}</span></div>

                            <div className="space-y-3" >
                                { draft_projects.length == 0  &&
                                    (
                                        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-white/15 p-5 text-center"><span className="mx-auto mb-2 h-8 w-8 rounded-lg bg-neutral-100 dark:bg-white/5 grid place-items-center text-neutral-500 dark:text-neutral-400"><FolderKanban className="w-4 h-4" /> </span><p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Nothing here yet</p></div>
                                    ) 
                                }

                                { draft_projects.length > 0 && (
                                    draft_projects.map((p) => (
                                        <button key={p.id}  className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full text-left block hover:border-neutral-400 dark:hover:border-white/30 transition">
                                            <p className="font-bold text-sm">{p.name} </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{p.client?.name} </p>
                                            <div className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-200 dark:border-white/10 px-3 py-2.5 mt-2">
                                                <span className="h-7 w-7 rounded-md bg-emerald-50 dark:bg-[#00ed64]/10 text-emerald-700 dark:text-[#00ed64] grid place-items-center">
                                                    <ListTodo className="h-4 w-4" />
                                                </span>

                                                <div>
                                                    <p className="text-xs font-semibold">Milestones not started</p>
                                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    Add steps from project details
                                                    </p>
                                                </div>
                                            </div>
                                            {/* <div class="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden my-2"><div class="h-full bg-emerald-600 dark:bg-[#00ed64]" style="width:50%"></div></div><div class="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400"><span>2/4 milestones</span><span class="rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">Pending</span></div> */}
                                            </button>
                                    ))
                                ) }

                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
        
        { modal === "new-proj" && (
            <NewProjectModal 
                onClose={() => setModal("")}
            />
        ) }
    </main>
    )
}

export default Projects