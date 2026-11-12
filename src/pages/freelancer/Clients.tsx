import Sidebar from "../../components/freelancer/Sidebar"
import Topbar from "../../components/freelancer/Topbar"


const Clients = () => {
    return (
        <main>
            <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
                <Sidebar />

                <div className="min-w-0" >
                    <Topbar label={"Clients"} />

                    <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                        
                        
                    </main>
                </div>
            </div>
        </main>
    )
}

export default Clients