import { Bell, CreditCard, FolderKanban, LayoutDashboard, Receipt, Settings, Users } from "lucide-react"
import { NavLink } from "react-router-dom"

const sideLinks = [
    { label:"Overview", to:"/overview", icon: LayoutDashboard , end: true},
    { label:"Clients", to:"/clients", icon: Users },
    { label:"Projects", to:"/projects", icon: FolderKanban },
    { label:"Invoices", to:"/invoices", icon: Receipt },
    { label:"Notifications", to:"/notifications", icon: Bell },
    { label:"Billing", to:"/billing", icon: CreditCard },
    { label:"Settings", to:"/settings", icon: Settings },

]

export default function Sidebar () {

    return (
        <aside className="hidden md:flex flex-col gap-1 bg-neutral-950 dark:bg-neutral-900 text-white p-4 sticky top-0 h-screen" >
            <b className="flex items-center gap-2 text-lg tracking-tight mb-1"><span className="h-4 w-4 rounded bg-emerald-500"></span>Clientloop</b>

            <p className="text-xs text-neutral-400 mb-5 truncate">Studio Name</p>

            <div className="flex flex-col gap-1" >
                { sideLinks.map((s) => {
                    const Icon = s.icon
                    return (
                        <NavLink key={s.to} to={s.to} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold w-full text-left  ${isActive ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]" : "text-neutral-400 hover:text-white hover:bg-white/5" } ` } > <Icon className="h-4 w-4" /> {s.label} </NavLink>
                    )
                }) }
            </div>

            <div className="mt-auto rounded-lg bg-white/5 p-3 text-sm">
                <p className="font-semibold truncate">Studio Name</p>
                <p className="text-xs text-neutral-400">Free Plan</p>
            </div>
        </aside>
    )
}