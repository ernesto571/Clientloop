
import { useNavigate, useParams } from "react-router-dom"
import Sidebar from "../../components/freelancer/Sidebar"
import Topbar from "../../components/freelancer/Topbar"
import { useProjectStore } from "../../store/ProjectStore"
import { useEffect, useRef, useState } from "react";
import { Check, FileText, ListTodo, MessageCircle, Milestone, Pencil, Plus, Send, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import UpdateMilestoneModal from "../../components/freelancer/UpdateMilestoneModal";
import UploadDeliiverableModal from "../../components/freelancer/UploadDeliiverableModal";
import { useCommentStore } from "../../store/CommentStore";
import { useAuthStore } from "../../store/AuthStore";


export interface Project {
    id: string;
    name: string;
    status: string;
    created_at: string;
    client: {
        id: string;
        name: string;
        email: string;
    } | null ;
}

export interface Milestone {
    id: string;
    title: string;
    is_completed: boolean;
}

type ProjectStatus = "Draft" | "In Progress" | "In Review" | "Completed";


const ProjectDetails = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const { fetchProjects, isLoading,deliverableLoading, projects, milestones, deliverables, updateProjectStatus, setMilestoneFormData, milestoneFormData , milestoneLoading, addMilestone, fetchMilestones, updateMilestoneStatus, deleteMilestone, fetchDeliverables, downloadDeliverable, deleteDeliverable } = useProjectStore()
    const { comments, commentLoading, sendComment, fetchComments, subscribeToComments, unsubscribeFromComments } = useCommentStore()
    const session = useAuthStore.getState().session
    const userId = session?.user.id
    const userRole = session?.user.user_metadata?.role

    const [project, setProject] = useState<Project | null>(null)
    const [status, setStatus] = useState<ProjectStatus>("Draft")
    const [ milestoneStatus, setMilestoneStatus ] = useState<boolean>()
    const [ modal, setModal] = useState("")
    const [ milestone, setMilestone ] = useState<Milestone> ()
    const [message, setMessage] = useState("")
    const bottomRef = useRef<HTMLDivElement>(null)

    const completedMilestones = milestones.filter((m) => m.is_completed).length;
    const milestoneProgress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

    const stages: { label: ProjectStatus; onclick: () => void }[] = [
        { label:"Draft", onclick: () => handleStatusChange("Draft") },
        { label:"In Progress", onclick: () => handleStatusChange("In Progress") },
        { label:"In Review", onclick: () => handleStatusChange("In Review") },
        { label:"Completed", onclick: () => handleStatusChange("Completed") }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement > ) => {
        setMilestoneFormData({ [e.target.name]: e.target.value });
    };

    const handleStatusChange = async (newStatus: ProjectStatus) => {
        if (!project?.id || newStatus === status) return;

        setStatus(newStatus);

        await updateProjectStatus(newStatus, project.id);
    }

    const handleAddMilestone = async () => {
        if (!milestoneFormData.title?.trim()) return toast.error("Enter a milestone.");
        
        try {
            await addMilestone(milestoneFormData, project!.id)
            const err = useProjectStore.getState().error
            if (err) return toast.error(err)
        } catch (err) {
            console.error("Error in handleAddMilestone", err);
        }
    }

    const handleSendComment = async () => {
        if (!message.trim()) return

        await sendComment(project!.id, message)
        setMessage("")
    }

    useEffect(() => {
        if (projects.length === 0) {
            fetchProjects()
            return
        }

        const found = projects.find((p) => p.id === id) ?? null
        setProject(found)

        if (found && ["Draft", "In Progress", "In Review", "Completed"].includes(found.status)) {
            setStatus(found.status as ProjectStatus)
        }

        fetchMilestones(found!.id)
        fetchDeliverables(found!.id)
        fetchComments(found!.id)
        subscribeToComments(found!.id)

        return () => unsubscribeFromComments()

    }, [projects, id])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [comments])

    const currentIndex = stages.findIndex((stage) => stage.label === status)

    return (
        <main>
            <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
                <Sidebar />

                <div className="min-w-0" >
                    <Topbar label={"Project"} />

                    <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition mb-3" onClick={() => navigate("/projects")} >Back to Projects</button>

                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-2xl font-extrabold tracking-tight">
                                {project?.name} 
                                <span className="block text-sm font-normal text-neutral-500 dark:text-neutral-400 mt-1">{project?.client?.name} </span>
                            </h2>
                            <div className="flex gap-2"><div className="text-right"><p className="text-3xl font-extrabold leading-none">{milestoneProgress}%</p><p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">complete</p></div></div>
                        </div>

                        <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm !p-4 sm:!p-5 mb-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Project status</p>
                                    <p className="font-bold mt-1">{status} </p>
                                </div>
                                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${ status === "Draft" ? "bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-300" : ( status === "In Review" ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" :( status === "In Progress" ? "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" ) ) }`}>{status} </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {stages.map((stage, index) => {
                                    const isCompleted = index < currentIndex;
                                    const isCurrent = index === currentIndex;

                                    return (
                                        <button
                                            key={stage.label}
                                            type="button"
                                            onClick={stage.onclick}
                                            className={`group rounded-xl border px-3 py-3 text-left transition hover:border-emerald-400 ${
                                                isCurrent
                                                    ? "border-emerald-500 bg-emerald-50 dark:border-[#00ed64] dark:bg-[#00ed64]/10"
                                                    : isCompleted
                                                    ? "border-emerald-200 bg-emerald-50/50 dark:border-[#00ed64]/20 dark:bg-[#00ed64]/5"
                                                    : "border-neutral-200 dark:border-white/10"
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className={`h-7 w-7 rounded-full grid place-items-center text-xs font-bold ${
                                                        isCompleted
                                                            ? "bg-emerald-600/10 text-emerald-700 dark:text-[#00ed64]"
                                                            : isCurrent
                                                            ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]"
                                                            : "border border-neutral-300 dark:border-white/20 text-neutral-500 dark:text-neutral-400"
                                                    }`}
                                                >
                                                    {isCompleted ? (
                                                        <Check className="h-3.5 w-3.5" />
                                                    ) : (
                                                        index + 1
                                                    )}
                                                </span>

                                                <span className="text-xs sm:text-sm font-semibold">
                                                    {stage.label}
                                                </span>
                                            </span>

                                            <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 mt-2">
                                                {isCompleted
                                                    ? "Completed stage"
                                                    : isCurrent
                                                    ? "Current stage"
                                                    : "Set as current"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">Choose a stage to update the project status. Your client will see the change.</p>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-4 items-start" >
                            <div className="lg:col-span-7 space-y-4" > 
                                {/* milestones tab */}
                                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5" >
                                    <div className="flex items-center justify-between"><h3 className="font-bold">Milestones</h3> <span className="text-sm text-neutral-500 dark:text-neutral-400">{completedMilestones} of {milestones.length} done</span></div>

                                    { milestones.length == 0 && (
                                        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-white/15 bg-neutral-50/70 dark:bg-white/[0.02] mt-4 px-5 py-8 text-center"><span className="mx-auto h-12 w-12 rounded-xl bg-emerald-50 dark:bg-[#00ed64]/10 text-emerald-700 dark:text-[#00ed64] grid place-items-center"><ListTodo className="w-6 h-6 " /></span><p className="font-bold mt-3">No milestones added yet</p><p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mt-1">This project starts with a clean slate. Add milestones when you’re ready to map out the work.</p><p className="text-xs font-semibold text-emerald-700 dark:text-[#00ed64] mt-3">Ideas: Kickoff · First draft · Final review</p></div>
                                    ) } 

                                    { milestones.length > 0 && (
                                        <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden my-2"><div className="h-full bg-emerald-600 dark:bg-[#00ed64]" style={{width: `${milestoneProgress}%`}}></div></div>

                                    ) }

                                    { milestones.length > 0 && (
                                        <div className="divide-y divide-neutral-200 dark:divide-white/10" >
                                            { milestones.map((m) => (
                                                <div key={m.id} className="flex items-center gap-3 py-2.5" >
                                                    <label className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer" onClick={() => { setMilestoneStatus(m.is_completed); updateMilestoneStatus(m.id, project!.id, !milestoneStatus) } } >
                                                        <input type="checkbox" className="peer sr-only"  />
                                                        <span className={`h-5 w-5 shrink-0 rounded-full border-2 border-neutral-300 dark:border-white/20 grid place-items-center text-transparent  ${ m.is_completed === true ? "bg-emerald-600 dark:bg-[#00ed64] border-transparent text-white dark:text-[#001e2b]" : "" }`}>
                                                            <Check className={`${m.is_completed === true ? "flex" : "hidden"} w-3 h-3`} />
                                                        </span>
                                                        
                                                        <span className={`text-sm truncate ${ m.is_completed === true ? "line-through text-neutral-500 dark:text-neutral-400" : "" } `}>{m.title} </span>
                                                    </label>
                                                    
                                                    <button  onClick={ () => {setMilestone(m); setModal("edit") }}  type="button" className="h-8 w-8 shrink-0 grid place-items-center rounded-lg text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-[#00ed64] dark:hover:bg-[#00ed64]/10 transition" title="Edit milestone text" aria-label="Edit milestone First set"><Pencil className="w-4 h-4" /> </button>
                                                    
                                                    <button disabled={milestoneLoading} onClick={() => deleteMilestone(m.id, project!.id) } type="button" className="h-8 w-8 shrink-0 grid place-items-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition" title="Delete milestone" aria-label="Delete milestone First set" ><Trash2 className="w-4 h-4" /> </button>
                                                </div>
                                            )) }
                                        </div>
                                    )}

                                    <form className="flex gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); handleAddMilestone(); }}>
                                        <input className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" type="text" name="title" value={milestoneFormData.title} onChange={handleChange} placeholder={`${milestones.length == 0 ? "Add Your First Milestone" :"New Milestone" } `} />
                                        <button disabled={milestoneLoading} type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition disabled:opacity-50">
                                            <Plus className="w-4 h-4" /> Add
                                        </button>
                                    </form>
                                    
                                </div>

                                {/* deeliverables tab */}
                                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5" >
                                    <div className="flex items-center justify-between mb-1"><h3 className="font-bold">Deliverables</h3><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition" onClick={() => setModal("upload")} ><Upload className="w-4 h-4" /> Upload</button></div>

                                    { deliverables.length == 0 && (
                                        <div className="rounded-lg border border-dashed border-neutral-300 dark:border-white/15 p-5 text-center mt-2"><p className="font-bold text-sm">No Files Yet</p><p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Upload a deliverable and your client can review it here.</p></div>
                                    ) }

                                    { deliverables.length > 0 && (
                                        <div>
                                            { deliverables.map((d) => (
                                                <div className="py-4 border-b last:border-0 border-neutral-200 dark:border-white/10" key={d.id} >
                                                    <div className="flex flex-wrap items-start gap-3" >
                                                        <span className="h-10 w-10 shrink-0 rounded-xl grid place-items-center bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400"><FileText className="w-5 h-5" /> </span>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-semibold text-sm">{d.title} </p>
                                                            <button
                                                                disabled={deliverableLoading}
                                                                onClick={() => downloadDeliverable(d.file_path, d.file_name)}
                                                                className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5
                                                                hover:text-emerald-700 dark:hover:text-[#00ed64]
                                                                hover:underline underline-offset-4
                                                                transition-colors duration-200
                                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                                cursor-pointer text-left"
                                                            >
                                                                {d.file_name}
                                                            </button>
                                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 whitespace-pre-wrap">{d.description} </p>
                                                            
                                                        </div>
                                                        <div className="flex flex-col gap-2" >
                                                        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${ d.status === "Pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" }`}>{d.status} </span>

                                                        <button disabled={deliverableLoading} onClick={() => deleteDeliverable(d.id, d.file_path, project!.id) } type="button" className="h-8 w-8 shrink-0 grid place-items-center rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition" title="Delete milestone" aria-label="Delete milestone First set" ><Trash2 className="w-4 h-4" /> </button>
                                                        </div>
                                                        
                                                        
                                                        {/* <button disabled={deliverableLoading}
                                                                onClick={() => downloadDeliverable(d.file_path, d.file_name)}
                                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-[#00ed64] mt-2 disabled:opacity-50 ">
                                                                <Download className="w-3.5 h-3.5" />
                                                                Download File
                                                            </button> */}
                                                    </div>
                                                </div>
                                            )) }
                                        </div>
                                    ) } 
                                </div>
                            </div>

                            {/* comments */}
                            <div className="lg:col-span-5 space-y-4" >
                                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5" >
                                    <h3 className="font-bold mb-3">Comments</h3>
                                    { comments.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center px-5">
                                            <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mb-4">
                                                <MessageCircle className="w-6 h-6 text-neutral-400" />
                                            </div>
                                        
                                            <h3 className="text-sm font-semibold text-neutral-800 dark:text-white mb-1">
                                                No messages yet
                                            </h3>
                                        
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[230px] leading-relaxed">
                                                Start a conversation with your {userRole === "freelancer" ? "client" : "freelancer"}.
                                                Your messages will appear here.
                                            </p>
                                        </div>
                                    ) } 

                                   { comments.length > 0 && (
                                    <div className="h-100 overflow-y-auto overscroll-contain pr-2 scrollbar-thin">
                                        {comments.map((c) => (
                                            <div
                                                key={c.id}
                                                className={`flex flex-col mb-3 ${c.user_id === userId ? "items-end" : "items-start"}`}
                                            >
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                                    {c.user_id === userId ? "You" : "Client"}
                                                </span>

                                                <p className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${c.user_id === userId ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]" : "bg-neutral-100 dark:bg-white/5"}`}>
                                                    {c.message}
                                                </p>
                                            </div>
                                        ))}

                                        <div ref={bottomRef} />
                                    </div>
                                   ) } 
                                    <div className="flex gap-2 mt-2">
                                        <input value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                                        className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Write a Comment" />
                                        <button onClick={handleSendComment}
                                        disabled={!message.trim()}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition disabled:opacity-50 " aria-label="Send" ><Send className="w-4 h-4" /> </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                    </main>
                </div>
            </div>
            { modal === "edit" && (
                <UpdateMilestoneModal 
                    onClose={() => setModal("")}
                    milestone={milestone!}
                    project_id={project!.id}
                />
            ) }
            { modal === "upload" && (
                <UploadDeliiverableModal 
                    onClose={() => setModal("")}
                    project_id={project!.id}
                />
            ) }

        </main>
    )
}

export default ProjectDetails
