import { useState } from "react"

export default function Pricing() {

    const [ activeTab, setActiveTab ] = useState("mon")

    return (
        <section id="pricing" className="border-y border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/40" >
            <div className="mx-auto max-w-6xl px-4 py-20" >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Simple Pricing</h2>

                    <div className="flex rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-0.5 text-sm font-semibold">
                        <button onClick={() => setActiveTab("mon")} className={`px-3 py-1.5 rounded-md ${activeTab === "mon" ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]" : "text-neutral-500 dark:text-neutral-400"} `}>Monthly</button>
                        <button onClick={() => setActiveTab("year")} className={`px-3 py-1.5 rounded-md ${activeTab === "year" ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]" : "text-neutral-500 dark:text-neutral-400"} `}>Annual · Save 17%</button>
                    </div>

                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-3xl">
                    <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5">
                        <h3 className="font-bold">Free</h3>
                        <p className="text-4xl font-extrabold mt-2">$0</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-5">3 clients, 3 projects, invoices, comments.</p>
                        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition w-full">Start Free</button>
                    </div>

                    { activeTab === "mon" && (
                        <div className="rounded-xl border-2  bg-white dark:bg-neutral-900 shadow-sm p-5  !border-emerald-600 dark:!border-[#00ed64]">
                            <h3 className="font-bold">Pro</h3>
                            <p className="text-4xl font-extrabold mt-2">$12<span className="text-base text-neutral-500 dark:text-neutral-400">/mo</span></p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-5">Unlimited clients and projects, custom branding.</p>
                            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full" >Go Pro</button>
                        </div>
                    ) }
                    { activeTab === "year" && (
                        <div className="rounded-xl border-2  bg-white dark:bg-neutral-900 shadow-sm p-5  !border-emerald-600 dark:!border-[#00ed64]">
                            <h3 className="font-bold">Pro</h3>
                            <p className="text-4xl font-extrabold mt-2">$10<span className="text-base text-neutral-500 dark:text-neutral-400">/mo</span></p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-5">Unlimited clients and projects, custom branding. Billed $120 a year.</p>
                            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full" >Go Pro</button>
                        </div>
                    ) }
                </div>
            </div>

        </section>
    )
}