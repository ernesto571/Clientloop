import Compare from "../components/Home/Compare";
import FAQ from "../components/Home/FAQ";
import Hero from "../components/Home/Hero";
import Navbar from "../components/Home/Navbar";
import Pricing from "../components/Home/Pricing";
import Product from "../components/Home/Product";


export default function HomePage (){

    return (
        <main>
            <Navbar />

            <Hero />
            <Product />
            <Compare />
            <Pricing />
            <FAQ />

            <section className="mx-auto max-w-6xl px-4 pb-20"><div className="rounded-xl bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] p-10 text-center"><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Stop Chasing Clients by Email</h2><button className="mt-6 rounded-lg bg-white dark:bg-[#001e2b] text-neutral-950 dark:text-[#00ed64] px-5 py-3 text-sm font-semibold" >Create Your Free Account</button></div></section>

            <footer className="bg-neutral-950 text-neutral-400 text-sm"><div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8"><div className="col-span-2 md:col-span-1"><b className="text-white text-lg">Clientloop</b><p className="mt-2">The client portal for freelancers.</p><button className="mt-3 underline" >Client Login</button></div><div><p className="text-white font-semibold mb-3">Product</p><p className="py-1">Features</p><p className="py-1">Pricing</p><p className="py-1">Changelog</p></div><div><p className="text-white font-semibold mb-3">Resources</p><p className="py-1">Docs</p><p className="py-1">Guides</p><p className="py-1">Support</p></div><div><p className="text-white font-semibold mb-3">Company</p><p className="py-1">About</p><p className="py-1">Blog</p><p className="py-1">Contact</p></div></div><p className="mx-auto max-w-6xl px-4 pb-8 text-xs">© Clientloop · Demo prototype</p></footer>
        </main>
    )
}