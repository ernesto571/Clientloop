
export default function FAQ () {

    return (
        <section id="faq" className="mx-auto max-w-6xl px-4 py-20 " >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">Questions</h2>

            <details className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 mb-3 "><summary className="font-bold cursor-pointer">Do Clients Need an Account?</summary><p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Clients get an invite link and set a password in seconds.</p></details>

            <details className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 mb-3 "><summary className="font-bold cursor-pointer">Can Clients See Other Clients’ Work?</summary><p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">No. Each client only sees their own projects and invoices.</p></details>

            <details className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 mb-3 "><summary className="font-bold cursor-pointer">How Do Payments Work?</summary><p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Clients pay invoices through a secure checkout.</p></details>

            <details className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 mb-3 "><summary className="font-bold cursor-pointer">Can I Cancel Anytime?</summary><p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Yes. Switch back to Free whenever you like.</p></details>

        </section>
    )

}