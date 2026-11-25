import { useState } from "react";
import Navbar from "../components/Home/Navbar"
import { useAuthStore } from "../store/AuthStore";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AcceptInvite = () => {

    const navigate = useNavigate()
    const { acceptInvite, acceptInviteFormData, setAcceptInviteFormData, isLoading } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAcceptInviteFormData({ [e.target.name]: e.target.value });
    };

    const handleAcceptInvite = async () => {
        if (!acceptInviteFormData.email?.trim()) return toast.error("Email is required.");
        if (!/^\S+@\S+\.\S+$/.test(acceptInviteFormData.email.trim())) return toast.error("Enter a valid email address.");
        if (!acceptInviteFormData.password) return toast.error("Password is required.");
        if (acceptInviteFormData.password.length < 6) return toast.error("Password must be at least 6 characters.");
        try {
            const ok = await acceptInvite(acceptInviteFormData)
            const err = useAuthStore.getState().error
            if (err) return toast.error(err)
            if (ok) navigate("/client/project")

        } catch (err) {
            console.error("Error in handleAcceptInvite", err);
        }

    };

    return (
        <main>
            <Navbar />
            <div className="px-5 py-16 sm:py-24" >
                <div className="mx-auto w-full max-w-md rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Accept your invite</h1>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Enter the email you were invited with and create a password.</p>

                    <div className="mt-6 space-y-4" >
                        <div>
                            <label htmlFor="email" className="text-sm font-semibold">Email</label>
                            <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-[15px] outline-none transition focus:border-emerald-600 dark:focus:border-[#00ed64] focus:ring-4 focus:ring-emerald-600/10 dark:focus:ring-[#00ed64]/10" onChange={handleChange} value={acceptInviteFormData.email} />
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-semibold">Password</label>
                            <div className=" relative">
                                <input name="password" type={showPassword ? "text" : "password"}className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Create a password (6+ characters)" onChange={handleChange} value={acceptInviteFormData.password}></input>
                                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>                        
                        </div>

                        <div>
                            <label htmlFor="confirm" className="text-sm font-semibold">Confirm password</label>
                            <div className=" relative">
                                <input name="confirm" type={showPassword ? "text" : "password"}className="mt-1.5 w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Confirm password" onChange={handleChange} value={acceptInviteFormData.confirm}></input>
                                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 className">
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>   
                        </div>

                        <p role="alert" className="hidden rounded-lg border border-red-200 dark:border-red-500/25 bg-red-50 dark:bg-red-500/10 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-300"></p>

                        <button onClick={handleAcceptInvite} disabled={isLoading} type="submit" className="w-full rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-4 py-3 text-[15px] font-bold shadow-sm hover:bg-emerald-500 transition disabled:opacity-50">Accept Invite</button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AcceptInvite