import { Fragment } from "react"
import { Check, Ban } from "lucide-react"

const STEPS = ["Created", "Sent", "Paid"]
const STEP_INDEX: Record<string, number> = { Draft: 0, Sent: 1, Overdue: 1, Paid: 2 }

export default function InvoiceProgress({ status }: { status: string }) {
    // Cancelled: show a note instead of the steps
    if (status === "Cancelled") {
        return (
            <div className="mt-5 flex items-center gap-2 rounded-lg bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400 px-3 py-2 text-xs font-semibold">
                <Ban className="h-3.5 w-3.5" />
                This invoice was cancelled.
            </div>
        )
    }

    const current = STEP_INDEX[status] ?? 0

    return (
        <div className="mt-5">
            <div className="flex items-center">
                {STEPS.map((label, k) => {
                    const done = k < current || status === "Paid"      // ticked
                    const now = k === current && status !== "Paid"     // the step it's on
                    const overdue = now && status === "Overdue"        // red version of "now"

                    const circle = done
                        ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]"
                        : overdue
                            ? "bg-red-500 text-white"
                            : now
                                ? "ring-2 ring-emerald-600 dark:ring-[#00ed64] text-emerald-700 dark:text-[#00ed64]"
                                : "border border-neutral-300 dark:border-white/20"

                    const text = overdue
                        ? "text-red-600 dark:text-red-400"
                        : done || now
                            ? ""
                            : "text-neutral-500 dark:text-neutral-400"

                    return (
                        <Fragment key={label}>
                            {/* line before every step except the first */}
                            {k > 0 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 rounded-full ${
                                        k <= current
                                            ? overdue
                                                ? "bg-red-500"
                                                : "bg-emerald-600 dark:bg-[#00ed64]"
                                            : "bg-neutral-200 dark:bg-white/10"
                                    }`}
                                />
                            )}

                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${text}`}>
                                <span className={`h-5 w-5 shrink-0 rounded-full grid place-items-center text-[10px] ${circle}`}>
                                    {done ? <Check className="h-3 w-3" /> : overdue ? "!" : k + 1}
                                </span>
                                {overdue ? "Overdue" : label}
                            </div>
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}