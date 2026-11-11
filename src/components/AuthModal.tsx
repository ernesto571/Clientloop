import { Eye, EyeOff, Globe, X } from "lucide-react";
import { useState } from "react";

interface modalProps {
    label: string
    onClose: () => void;
}

export default function AuthModal ( {label, onClose} : modalProps ) {

    const [ activeTab, setActiveTab ] = useState(label)
    const [showPassword, setShowPassword] = useState(false);

    return (
        <section onClick={onClose} className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4" >
            { activeTab === "sign-in" && (
                <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Welcome Back</h3>
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transitio" aria-label="Close" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-3">

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition w-full" >
                            <Globe className="h-4 w-4" />Continue with Google
                        </button>
                        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">or use email</p>

                        <input name="email" type="email" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="you@email.com"  value=""></input>

                        <div className=" relative">
                            <input name="password" type="password" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Password" ></input>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full" >Sign In</button>

                        <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold text-emerald-700 dark:text-[#00ed64]"><button >Forgot Password?</button><button onClick={() => setActiveTab("sign-up")} >Create an Account</button></div>

                        <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-white/10">Are you a client? <button className="font-semibold underline" onClick={() => setActiveTab("client-login")} >Client sign in</button></p>
                    </div>

                </div>
            ) }

            { activeTab === "sign-up" && (
                <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Create Your Account</h3>
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transitio" aria-label="Close" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-3">

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition w-full" >
                            <Globe className="h-4 w-4" />Continue with Google
                        </button>
                        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">or use email</p>

                        <input name="name" type="text" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Full Name"  value=""></input>

                        <input name="email" type="email" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="you@email.com"  value=""></input>

                        <div className=" relative">
                            <input name="password" type="password" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Password (6+ characters)" ></input>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full" >Create Account</button>

                        <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold text-emerald-700 dark:text-[#00ed64]"><button onClick={() => setActiveTab("sign-in")} >Back to Sign In</button></div>

                        <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-white/10">Are you a client? <button className="font-semibold underline" onClick={() => setActiveTab("client-login")} >Client sign in</button></p>
                    </div>

                </div>
            ) }

            { activeTab === "client-login" && (
                <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Client Sign In</h3>
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transitio" aria-label="Close" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-3">

                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Sign in to view projects, approve work, and pay invoices.</p>

                        <input name="email" type="email" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Email your freelancer invited"  value=""></input>

                        <div className=" relative">
                            <input name="password" type="password" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Password" ></input>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full" >Sign In</button>

                        <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold text-emerald-700 dark:text-[#00ed64]"><button >Forgot Password?</button><button onClick={() => setActiveTab("client-invite")} >Accept an Invite</button></div>

                        <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-white/10">Freelancer? <button className="font-semibold underline" onClick={() => setActiveTab("sign-in")} >Sign in here</button></p>
                    </div>

                </div>
            ) }

            { activeTab === "client-invite" && (
                <div onClick={(e) => e.stopPropagation()} className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto" >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Accept Your Invite</h3>
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transitio" aria-label="Close" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-3">

                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Set a password to open your project portal.</p>

                        <input name="email" type="email" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Email your freelancer invited"  value=""></input>

                        <div className=" relative">
                            <input name="password" type="password" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Create a password (6+ characters)" ></input>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <div className=" relative">
                            <input name="password" type="password" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Confirm password" ></input>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full" >Set password and Continue</button>

                        <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold text-emerald-700 dark:text-[#00ed64]"><button onClick={() => setActiveTab("client-login")} >Back to Sign In</button></div>

                        <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-white/10">Freelancer? <button className="font-semibold underline" onClick={() => setActiveTab("sign-in")} >Sign in here</button></p>
                    </div>

                </div>
            ) }
            
        </section>
    )
}