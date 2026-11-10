import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar(){
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false);
    const [dark, setDark] = useState(() => localStorage.theme ? localStorage.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches)

    useEffect (() => {
        const onScroll = () => {
          setScrolled(window.scrollY > 36);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
        localStorage.theme = dark ? "dark" : "light"
    }, [dark])

    const handleToggle = () => setDark(d => !d)

    return(
        <main>
            <div className="bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] text-center text-sm font-semibold px-4 py-2">New: email alerts for approvals and payments</div>

            <nav className={`inset-x-0 top-0 z-50 h-16 border-b border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 ${scrolled ? "fixed shadow-sm" : "relative"}`} >
                <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-full" >
                    <b className="flex items-center gap-2 text-lg tracking-tight"><span className="h-4 w-4 rounded bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]"></span>Clientloop</b>

                    <div className="hidden md:flex gap-7 text-sm font-semibold text-neutral-500 dark:text-neutral-400" >
                        <a href="#product">Product</a>
                        <a href="#compare">Why Clientloop</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#faq">FAQ</a>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="hidden sm:inline-flex px-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400" >Client Login</button>

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition">Sign In</button>

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition">Get Started</button>

                        <button onClick={handleToggle} aria-label="Toggle Theme" className="grid h-9 w-9 place-items-center rounded-full bg-tint transition active:scale-95">
                            <Moon className="h-4 w-4 dark:hidden" />
                            <Sun className="hidden h-4 w-4 dark:block" />
                        </button>
                    </div>
                </div>

                
            </nav>
            {scrolled && <div className="h-16"></div>}
        </main>

    )
}