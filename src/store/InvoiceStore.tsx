import { create } from "zustand"
import { useAuthStore } from "./AuthStore";
import { supabase } from "../lib/supabase-client";

export interface LineItemFormData {
    id: string;          // only for React's key
    description: string;
    price: string;
}

export interface InvoiceFormData {
    project_id: string;
    items: LineItemFormData[];
}

interface InvoiceStore {
    invoiceFormData: InvoiceFormData
    invoiceLoading: boolean
    error: string| null
    saveAsDraft: (data:InvoiceFormData, project_id: string, total: number, clientId:string ) => Promise<void>
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

export const useInvoiceStore = create<InvoiceStore>((set) => ({
    invoiceFormData: initialInvoiceFormData(),
    invoiceLoading:false,
    error: null,

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

        } catch (err: any) {
            console.error("🔴 saveAsDraft : failed", err.message)
        } finally {
            set({ invoiceLoading: false });
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