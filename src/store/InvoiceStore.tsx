import { create } from "zustand"
import { useAuthStore } from "./AuthStore";
import { supabase } from "../lib/supabase-client";
import toast from "react-hot-toast";

export interface LineItemFormData {
    id: string;          // only for React's key
    description: string;
    price: string;
}

export interface InvoiceFormData {
    project_id: string;
    items: LineItemFormData[];
}

export interface Invoice {
    id: string;
    client_id: string;
    invoice_number: string;
    status: string;
    total: number;
    created_at: string;
    items: {
        id: string;
        description: string;
        unit_price: number;
    }[] ;
    client: {
        id: string;
        name: string;
        email: string;
    };
    project: {
        id: string;
        name:string;
    }
}

interface InvoiceStore {
    invoiceFormData: InvoiceFormData
    invoiceLoading: boolean
    error: string | null
    invoices: Invoice[]
    fetchInvoices: () => Promise<void>
    saveAsDraft: (data:InvoiceFormData, project_id: string, total: number, clientId:string ) => Promise<void>
    createAndSend: (data:InvoiceFormData, project_id: string, total: number, clientId:string ) => Promise<void>
    updateInvoiceStatus: (status: string, id: string ) => Promise<void>
    deleteInvoice: (invoice_id: string) => Promise<void>;
    setInvoiceFormData: (data: Partial<InvoiceFormData>) => void;
    addLineItem: () => void;
    updateLineItem: (id: string, field: "description" | "price", value: string) => void;
    removeLineItem: (id: string) => void;
    resetInvoiceForm: () => void;
}

const emptyLineItem = (): LineItemFormData => ({
    id: crypto.randomUUID(),
    description: "",
    price: "",
})

const initialInvoiceFormData = (): InvoiceFormData => ({
    project_id: "",
    items: [emptyLineItem()],
})

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
    invoiceFormData: initialInvoiceFormData(),
    invoiceLoading:false,
    error: null,
    invoices: [],

    fetchInvoices:async() => {
        set({ invoiceLoading: true, error: null })
        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            const { data, error } = await supabase
                .from("invoices")
                .select(`
                    id,
                    client_id,
                    invoice_number,
                    status,
                    total,
                    created_at,
                    items:invoice_items (
                        id,
                        description,
                        unit_price
                    ),
                    client:clients (
                        id,
                        name,
                        email
                    ),
                    project:projects (
                        id,
                        name
                    )
                `)
                .eq("freelancer_id", userId)
                .order("created_at", { ascending: false });
    
            if (error) {
                console.error("Error fetching invoices:", error.message);
                set({ error: error.message });
                return;
            }
            console.log(data)
    
            // @ts-ignore
            set({ invoices: data ?? [] });
            
        } catch (err: any) {
            console.error("fetchInvoices failed:", err.message);
            set({ error: err.message });
        } finally {
            set({ invoiceLoading: false });
        }
    },

    saveAsDraft: async(data, id, total, clientId) => {
        set({ invoiceLoading: true, error: null })
        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            const {data: invData , error: invoiceError} = await supabase.from("invoices").insert({
                freelancer_id : userId,
                client_id : clientId,
                project_id : id,
                total: total,
                status: "Draft"
            }).select().single()
            if (invoiceError) {
                console.error("Failed to save to invoices", invoiceError.message)
                set({error:invoiceError.message})
                return
            }
            console.log(invData)

            const items = data.items.map((item) => ({
                // @ts-ignore
                invoice_id: invData.id,
                description: item.description.trim(),
                unit_price: Number(item.price),
            }))
            
            const { error } = await supabase.from("invoice_items").insert(items)

            if (error) {
                console.error("Failed to save to invoice_items", error.message)
                set({error:error.message})
                return
            }

            await get().fetchInvoices()

        } catch (err: any) {
            console.error("🔴 saveAsDraft : failed", err.message)
        } finally {
            set({ invoiceLoading: false });
        }
    },

    createAndSend: async(data, id, total, clientId) => {
        set({ invoiceLoading: true, error: null })
        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            const {data: invData , error: invoiceError} = await supabase.from("invoices").insert({
                freelancer_id : userId,
                client_id : clientId,
                project_id : id,
                total: total,
                status: "Sent"
            }).select().single()
            if (invoiceError) {
                console.error("Failed to save to invoices", invoiceError.message)
                set({error:invoiceError.message})
                return
            }
            console.log(invData)

            const items = data.items.map((item) => ({
                // @ts-ignore
                invoice_id: invData.id,
                description: item.description.trim(),
                unit_price: Number(item.price),
            }))
            
            const { error } = await supabase.from("invoice_items").insert(items)

            if (error) {
                console.error("Failed to save to invoice_items", error.message)
                set({error:error.message})
                return
            }

            await get().fetchInvoices()

        } catch (err: any) {
            console.error("🔴 saveAsDraft : failed", err.message)
        } finally {
            set({ invoiceLoading: false });
        }
    },

    updateInvoiceStatus : async (status, id) => {
        set({ invoiceLoading: true, error: null })
        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            const {error} = await supabase.from("invoices").update({
                status : status,
            }).eq("id", id).eq("freelancer_id", userId)
            if (error) {
                console.error("Failed to update invoice status", error.message)
                set({error:error.message})
                return
            }
            await get().fetchInvoices() 
        } catch (err: any) {
            console.error("🔴 updateProjectStatus : failed", err.message)
        } finally {
            set({ invoiceLoading: false });
        }
    },

    deleteInvoice: async (id) => {
        set({ invoiceLoading: true, error: null })
    
        try {
            
            const { error: deleteError } = await supabase
                .from("invoices")
                .delete()
                .eq("id", id)
    
            if (deleteError) {
                console.error("Failed to delete Invoice:", deleteError.message)
                set({ error: deleteError.message })
                toast.error(deleteError.message)
                return
            }
    
            // 3. Refresh deliverables
            await get().fetchInvoices()
    
            toast.success("Invoice deleted successfully")
    
        } catch (err: any) {
            console.error("deleteInvoice failed:", err.message)
            set({ error: err.message })
            toast.error(err.message)
        } finally {
            set({ invoiceLoading: false })
        }
    },
    
    setInvoiceFormData: (data) => set((s) => ({ invoiceFormData: { ...s.invoiceFormData, ...data } })),

    addLineItem: () => set((s) => ({
        invoiceFormData: {
            ...s.invoiceFormData,
            items: [...s.invoiceFormData.items, emptyLineItem()],
        },
    })),

    updateLineItem: (id, field, value) => set((s) => ({
        invoiceFormData: {
            ...s.invoiceFormData,
            items: s.invoiceFormData.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        },
    })),

    removeLineItem: (id) => set((s) => ({
        invoiceFormData: {
            ...s.invoiceFormData,
            items: s.invoiceFormData.items.length > 1
                ? s.invoiceFormData.items.filter(item => item.id !== id)
                : s.invoiceFormData.items,   // always keep at least one row
        },
    })),

    resetInvoiceForm: () => set({ invoiceFormData: initialInvoiceFormData() }),
}))