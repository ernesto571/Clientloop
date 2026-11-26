import ClientTopbar from "../../components/client/ClientTopbar"
import ClientSidebar from "../../components/client/CliientSidebar"

const ClientProject = () => {
    return (
      <main>
            <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950" >
                <ClientSidebar />

                <div className="min-w-0" >
                    <ClientTopbar label={"Projects"} />

                    <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10" >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-2xl font-extrabold tracking-tight">Your Projects</h2>
                            
                        </div>

                        

                    </main>
                </div>
            </div>
            
        </main>
    )
}

export default ClientProject