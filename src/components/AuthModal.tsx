import { Eye, EyeOff, Globe, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface modalProps {
    label: string
    onClose: () => void;
}

export default function AuthModal ( {label, onClose} : modalProps ) {

    const navigate = useNavigate()

    const [ activeTab, setActiveTab ] = useState(label)
    const [showPassword, setShowPassword] = useState(false);
    const { formData, session, login, signUp, setFormData, fetchSession, googleSignIn, isLoading } = useAuthStore()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        if (!formData.name?.trim()) return toast.error("Name is required.");
        if (!formData.email?.trim()) return toast.error("Email is required.");
        if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) return toast.error("Enter a valid email address.");
        if (!formData.password) return toast.error("Password is required.");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters.");
        try {
            await signUp(formData);
            const err = useAuthStore.getState().error
            if (err) return toast.error(err)
            // toast.success("Check your email to confirm your signup.", { duration: 8000 })
            navigate("/overview")
        } catch (err) {
            console.error("Error in handleSignup", err);
        }

    };

    const handleLogin = async () => {
        if (!formData.email?.trim()) return toast.error("Email is required.");
        if (!formData.password) return toast.error("Password is required.");
        try {
            await login(formData);
            const err = useAuthStore.getState().error
            if (err) return toast.error(err)
            navigate("/overview")
        } catch (err) {
            console.error("Error in handleLogin", err);
        }

    };

    const handleGoogleSignin = async () => {
        try {
            await googleSignIn()
        } catch (err) {
            console.error("Error in handleGoogleSignin", err);
        }
    }

    useEffect(() => { fetchSession() }, [])
    useEffect(() => {
        if (!session) return
        const role = session.user.user_metadata.role ?? "freelancer"
        navigate(role === "client" ? "/client/project" : "/overview")
    }, [session])

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

                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition w-full" onClick={handleGoogleSignin}>
                            <Globe className="h-4 w-4" />Continue with Google
                        </button>
                        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">or use email</p>

                        <input name="email" type="email" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="you@email.com"  onChange={handleChange} value={formData.email}></input>

                        <div className=" relative">
                            <input name="password" type={showPassword ? "text" : "password"}className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Password" onChange={handleChange} value={formData.password}></input>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <button disabled={ isLoading } className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full disabled:cursor-not-allowed disabled:opacity-50 " onClick={handleLogin} >Sign In</button>

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

                        <button onClick={handleGoogleSignin} className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition w-full" >
                            <Globe className="h-4 w-4" />Continue with Google
                        </button>
                        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">or use email</p>

                        <input name="name" type="text" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Full Name"   onChange={handleChange} value={formData.name}></input>

                        <input name="email" type="email" className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="you@email.com" onChange={handleChange} value={formData.email}></input>

                        <div className=" relative">
                            <input name="password" type={showPassword ? "text" : "password"}className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Password (6+ characters)" onChange={handleChange} value={formData.password} ></input> 
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <button disabled={ isLoading } onClick={handleSignup} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full disabled:cursor-not-allowed disabled:opacity-50 " >Create Account</button>

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
                            <input name="password" type={showPassword ? "text" : "password"}className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Password" ></input>
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
                            <input name="password" type={showPassword ? "text" : "password"}className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Create a password (6+ characters)" ></input>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>

                        <div className=" relative">
                            <input name="password" type={showPassword ? "text" : "password"}className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Confirm password" ></input>
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