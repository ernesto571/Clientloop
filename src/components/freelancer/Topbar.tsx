import { Bell, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface props {
    label: string
}

export default function Topbar ({label} : props) {
    
    const [dark, setDark] = useState(() => localStorage.theme ? localStorage.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
        localStorage.theme = dark ? "dark" : "light"
    }, [dark])

    const handleToggle = () => setDark(d => !d)

    return (
        <main>
            <header className="fixed top-0 inset-x-0 md:left-[232px] z-30 flex items-center justify-between gap-3 px-4 h-16 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-white/10" >
                <h1 className="hidden md:block font-bold truncate">{label}</h1>

                <div className="flex items-center gap-1.5" >
                    <button className="hidden md:flex items-center gap-2 w-56 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400"><Search className="h-4 w-4" /> Search…<kbd className="ml-auto text-xs">⌘K</kbd></button>

                    <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-neutral-200/60 dark:hover:bg-white/10" aria-label="Notifications" > <Bell className="w-4 h-4" /> </button>

                    <button onClick={handleToggle} aria-label="Toggle Theme" className="grid h-9 w-9 place-items-center rounded-full bg-tint transition active:scale-95">
                        <Moon className="h-4 w-4 dark:hidden" />
                        <Sun className="hidden h-4 w-4 dark:block" />
                    </button>

                    <div className="relative">
                        <button className="h-9 w-9 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] font-bold text-sm" aria-label="Account Menu" >S</button>
                    </div>
                </div>
            </header>

            <div className="h-16"></div>
        </main>
        
    )
}