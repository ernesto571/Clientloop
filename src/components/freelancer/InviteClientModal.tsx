import { X } from "lucide-react";
import { useClientStore } from "../../store/ClientStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface modalProps {
  onClose: () => void;
}

const InviteClientModal = ({ onClose }: modalProps) => {
  const navigate = useNavigate();

  const { isLoading, clientFormData, setFormData, inviteClient } =
    useClientStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleInviteClient = async () => {
    if (!clientFormData.name?.trim()) return toast.error("Name is required.");
    if (!clientFormData.email?.trim()) return toast.error("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(clientFormData.email.trim()))
      return toast.error("Enter a valid email address.");

    try {
        await inviteClient(clientFormData)
        const err = useClientStore.getState().error
        if (err) return toast.error(err)
        onClose()
        navigate("/clients")

    } catch (err) {
        console.error("Error in handleInviteClient", err);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4"
    >
      <div
        className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-sm p-5 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Invite a Client</h3>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10  py-2 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-white/5 transition !px-2"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-4 w-4" />{" "}
          </button>
        </div>
        <div className="space-y-3">
          <input
            name="name"
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            placeholder="Client Name"
            onChange={handleChange}
            value={clientFormData.name}
          />

          <input
            name="email"
            type="email"
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            placeholder="client@email.com"
            onChange={handleChange}
            value={clientFormData.email}
          />

          <button disabled={isLoading} onClick={handleInviteClient} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white dark:bg-[#00ed64] dark:text-[#001e2b] px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-500 transition w-full disabled:cursor-not-allowed disabled:opacity-50 ">
            Create Invite Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteClientModal;
