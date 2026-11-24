import Sidebar from "../../components/freelancer/Sidebar"
import Topbar from "../../components/freelancer/Topbar"
import { useEffect, useState } from "react"
import { User, Image, Bell, SunMoon, CreditCard, Shield, Sun, Moon, LogOut, Trash2 } from "lucide-react"
import { useProfileStore } from "../../store/ProfileStore"
import toast from "react-hot-toast"
import { useAuthStore } from "../../store/AuthStore"

const sections = [
    { id: "s-profile", label: "Profile", icon: User },
    { id: "s-brand", label: "Branding", icon: Image },
    { id: "s-notify", label: "Notifications", icon: Bell },
    { id: "s-look", label: "Appearance", icon: SunMoon },
    { id: "s-plan", label: "Plan", icon: CreditCard },
    { id: "s-account", label: "Account", icon: Shield },
]

const Settings  = () => {

    const { profile, profileFormData, setProfileFormData, fetchProfile, updateProfile, deleteAccount, profileLoading } = useProfileStore()
    const { logout } = useAuthStore()
    const [active, setActive] = useState("s-profile")

    const displayName = profileFormData?.business_name?.trim() || profileFormData?.name?.trim() || ""
    const names = displayName ? displayName.split(/\s+/) : []

    const ini = names![0]?.charAt(0).toUpperCase() ?? "";
    const displayEmail = profileFormData.email
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileFormData({ [e.target.name]: e.target.value });
    };

    const emailSettings = [
        { key: "billing", label: "Billing", description: "When a client pays an invoice", checked: true },
        { key: "files", label: "Files", description: "When a client approves a file or requests changes", checked: true },
        { key: "comments", label: "Comments", description: "When a client comments on a project", checked: true },
    ]

    const isDirty =
    (profileFormData.name ?? "").trim() !== (profile?.name ?? "") ||
    (profileFormData.business_name ?? "").trim() !== (profile?.business_name ?? "") ||
    (profileFormData.email ?? "").trim() !== (profile?.email ?? "")

    const handleDiscard = () => {
        setProfileFormData({
            name: profile?.name ?? "",
            business_name: profile?.business_name ?? "",
            email: profile?.email ?? "",
        })
    }

    const handleProfileUpdate = async () => {
        if (!profileFormData.name?.trim()) return toast.error("Name is required.");
        if (!profileFormData.email?.trim()) return toast.error("Email is required.");
        try {
            await updateProfile(profileFormData);
            
        } catch (err) {
            console.error("Error in handleProfileUpdate", err);
        }

    };

    const [dark, setDark] = useState(() => localStorage.theme ? localStorage.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches)

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
        localStorage.theme = dark ? "dark" : "light"
    }, [dark])

    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <main>
            <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
                <Sidebar />

                <div className="min-w-0" >
                    <Topbar label={"Settings"} />

                    <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 className="text-2xl font-extrabold tracking-tight">Settings</h2></div>

                        <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-6 items-start">
                            <nav aria-label="Settings sections" className="flex lg:flex-col gap-1 overflow-x-auto -mx-1 px-1 pb-1 lg:sticky lg:top-20">
                                {sections.map(({ id, label, icon: Icon }) => (
                                    <a key={id} href={`#${id}`} onClick={() => setActive(id)} className={`shrink-0 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${active === id ? "bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-white/10" : "border border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"}`}><Icon className="w-4 h-4" />{label}</a>
                                ))}
                            </nav>

                            <div className="min-w-0 max-w-3xl space-y-4" >
                                <section id="s-profile" className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 scroll-mt-20" >
                                    <div className="mb-4"><h3 className="font-bold">Profile</h3><p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">How you appear to clients on invoices and in their portal.</p></div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold">Your Name</label>
                                            <input className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm mt-1" name="name" value={profileFormData.name} onChange={handleChange} placeholder="e.g. Ada Okafor" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold">Business Name</label>
                                            <input className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm mt-1" name="business_name" value={profileFormData.business_name} onChange={handleChange}  />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="text-sm font-semibold" >Contact Email</label>
                                            <input type="email" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm mt-1" name="email" value={profileFormData.email} onChange={handleChange}  />
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">Shown on every invoice so clients know who to contact.</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 rounded-lg border border-dashed border-neutral-200 dark:border-white/10 p-4">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">Invoice Preview · From</p>
                                        <div className="flex items-center gap-3">
                                            <span className="h-10 w-10 shrink-0 rounded-lg grid place-items-center font-extrabold bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]">{ini} </span>
                                            <div className="min-w-0">
                                                <p className="font-semibold truncate">{displayName} </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{displayEmail} </p>
                                            </div>
                                        </div>
                                        <div className="mt-5 flex items-center justify-end gap-2">
                                            {isDirty && (
                                                <button type="button" onClick={handleDiscard} className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition">Discard</button>
                                            )}
                                            <button type="button" onClick={handleProfileUpdate} disabled={!isDirty || profileLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition disabled:opacity-40 disabled:pointer-events-none">Save Changes</button>
                                        </div>
                                    </div>
                                </section>

                                <section id="s-notify"className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 scroll-mt-20" >
                                    <div className="mb-4"><h3 className="font-bold">Email Notifications</h3><p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Everything shows in Notifications. Choose what also goes to {displayEmail} </p></div>
                                    
                                    {emailSettings.map(({ key, label, description, checked }) => (
                                        <div key={key} className="flex items-center justify-between gap-4 py-3 border-b last:border-0 border-neutral-200 dark:border-white/10">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold">{label}</p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>
                                            </div>
                                            <button type="button" role="switch" aria-checked={checked} aria-label={`Email me about ${label}`} className={`relative shrink-0 h-6 w-11 rounded-full transition ${checked ? "bg-emerald-600 dark:bg-[#00ed64]" : "bg-neutral-300 dark:bg-white/15"}`}>
                                                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`}></span>
                                            </button>
                                        </div>
                                    ))}
                                    
                                </section>

                                <section id="s-look" className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 scroll-mt-20">
                                    <div className="mb-4">
                                        <h3 className="font-bold">Appearance</h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Choose how Clientloop looks on this device.</p>
                                    </div>

                                    <div className="inline-flex w-full sm:w-72 rounded-lg bg-neutral-100 dark:bg-white/5 p-1 gap-1">
                                        <button type="button" onClick={() => setDark(false)} aria-pressed={!dark} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${!dark ? "bg-white dark:bg-neutral-800 shadow-sm" : "text-neutral-500 dark:text-neutral-400"}`}><Sun className="w-4 h-4" /> Light</button>

                                        <button type="button" onClick={() => setDark(true)} aria-pressed={dark} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${dark ? "bg-white dark:bg-neutral-800 shadow-sm" : "text-neutral-500 dark:text-neutral-400"}`}><Moon className="w-4 h-4" /> Dark</button>
                                    </div>
                                </section>   

                                <section id="s-account" className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 scroll-mt-20">
                                    <div className="mb-4">
                                        <h3 className="font-bold">Account</h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Signed in as {profile?.email}.</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b last:border-0 border-neutral-200 dark:border-white/10">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold">Sign Out</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">You’ll return to the landing page.</p>
                                        </div>
                                        <button onClick={() => logout} type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition"><LogOut className="w-4 h-4" /> Sign Out</button>
                                    </div>

                                    <div className="mt-4 rounded-lg border border-red-200 dark:border-red-500/25 bg-red-50/60 dark:bg-red-500/[0.06] p-4 flex flex-wrap items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Delete Account</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Permanently removes your clients, projects, invoices and files. This can’t be undone.</p>
                                        </div>
                                        <button onClick={() => deleteAccount} type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 dark:border-red-500/40 px-3.5 py-2 text-sm font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /> Delete Account</button>
                                    </div>
                                </section>                                                         
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            
        </main>
    )
}

export default Settings 