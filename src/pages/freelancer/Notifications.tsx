import { CheckCheck } from "lucide-react"
import Sidebar from "../../components/freelancer/Sidebar"
import Topbar from "../../components/freelancer/Topbar"


const Notifications = () => {
    return (
        <main>
            <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
                <Sidebar />

                <div className="min-w-0" >
                    <Topbar label={"Notifications"} />

                    <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 className="text-2xl font-extrabold tracking-tight">Notifications</h2><div className="flex gap-2"><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition disabled:opacity-40 disabled:pointer-events-none" ><CheckCheck className="w-4 h-4" /> Mark All as Read</button></div></div>
                    </main>
                </div>
            </div>
            
        </main>
    )
}

export default Notifications