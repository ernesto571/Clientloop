import { Plus } from "lucide-react";
import Sidebar from "../../components/freelancer/Sidebar";
import Topbar from "../../components/freelancer/Topbar";
import { useEffect, useState } from "react";
import InviteClientModal from "../../components/freelancer/InviteClientModal";
import { useClientStore } from "../../store/ClientStore";
import { useNavigate } from "react-router-dom";

const Clients = () => {
    const navigate = useNavigate()
  const [modal, setModal] = useState("");
  const { fetchClients, clients } = useClientStore();

  const [activeCategory, setActiveCategory] = useState("All");

  

  const filteredClients = clients?.filter(
    (c) => activeCategory === "All" || c.status === activeCategory
  )

  const invited = clients?.filter(
    (c) => c.status === "Invited"
  )

  const active = clients?.filter(
    (c) => c.status === "Active"
  )

  const categories = [
    { label: "All", length: clients.length },
    { label: "Active", length: active.length },
    { label: "Invited", length: invited.length },
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <main>
      <div className="md:grid md:grid-cols-[232px_1fr] min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Sidebar />

        <div className="min-w-0">
          <Topbar label={"Clients"} />

          <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Clients
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal("invite")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition"
                >
                  <Plus className="w-4 h-4" /> Invite Client
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-1">
                {categories.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setActiveCategory(c.label)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold  ${
                      activeCategory === c.label
                        ? "bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b]"
                        : " text-neutral-500 dark:text-neutral-400"
                    } `}
                  >
                    {c.label}
                    <span className="opacity-70 pl-1">{c.length} </span>
                  </button>
                ))}
              </div>
              <div className="w-44">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  2 of 3 clients used
                </p>
                <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden my-2">
                  <div
                    className="h-full bg-emerald-600 dark:bg-[#00ed64]"
                    style={{ width: "66.66%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm !p-0  overflow-hidden">
              <div className="hidden lg:grid lg:grid-cols-[1fr_80px_120px_260px] gap-x-4 gap-y-3 items-center px-5 py-3 text-sm font-bold text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-white/10">
                <span>Client</span>
                <span>Projects</span>
                <span className="text-right">Outstanding</span>
                <span></span>
              </div>

              {filteredClients.map((c) => (
                <div
                  key={c.id}
                  className="grid lg:grid-cols-[1fr_80px_120px_260px] gap-x-4 gap-y-3 items-center px-5 py-4 border-b last:border-0 border-neutral-200 dark:border-white/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-10 w-10 shrink-0 rounded-lg grid place-items-center font-extrabold bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                      {c.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold truncate">{c.name} </p>
                        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${c.status === "Active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 " :"bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" } `}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                        {c.email}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm"><span className="lg:hidden text-neutral-500 dark:text-neutral-400">Projects: </span><b>1</b></p>
                  <p className="text-sm lg:text-right"><span className="lg:hidden text-neutral-500 dark:text-neutral-400">Outstanding: </span><b>$1,200</b></p>

                  <div className="flex gap-2 lg:justify-end" >
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition" onClick={() => navigate("/projects")} >View Projects</button>

                    <button className={` ${ c.status === "Invited" ? "inline-flex" : "hidden" } items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3.5 py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition `} >Resend Invite</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      {modal === "invite" && <InviteClientModal onClose={() => setModal("")} />}
    </main>
  );
};

export default Clients;
