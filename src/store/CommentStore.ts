
import { create } from "zustand"
import { supabase } from "../lib/supabase-client"
import { useAuthStore } from "./AuthStore"
import toast from "react-hot-toast"

export interface CommentType {
    id: string
    project_id: string
    user_id: string
    message: string
    created_at: string
    updated_at: string
}

interface CommentStore {
    comments: CommentType[]
    commentLoading: boolean
    commentError: string | null
    fetchComments: (project_id: string) => Promise<void>
    sendComment: (project_id: string, message: string) => Promise<void>
    subscribeToComments: (project_id: string) => void
    unsubscribeFromComments: () => void
}

let commentChannel: ReturnType<typeof supabase.channel> | null = null

export const useCommentStore = create<CommentStore>((set) => ({
    comments: [],
    commentLoading: false,
    commentError: null,

    fetchComments: async (project_id) => {
        set({ commentLoading: true, commentError: null })

        try {
            const { data, error } = await supabase
                .from("comments")
                .select("*")
                .eq("project_id", project_id)
                .order("created_at", { ascending: true })

            if (error) {
                console.error("Failed to fetch comments:", error.message)
                set({ commentError: error.message })
                toast.error(error.message)
                return
            }

            set({ comments: data ?? [] })
        } catch (err: any) {
            console.error("fetchComments failed:", err.message)
            set({ commentError: err.message })
            toast.error(err.message)
        } finally {
            set({ commentLoading: false })
        }
    },

    sendComment: async (project_id, message) => {
        set({ commentLoading: true, commentError: null })

        const session = useAuthStore.getState().session
        const userId = session?.user.id

        try {
            if (!userId) {
                set({ commentError: "User not authenticated" })
                toast.error("User not authenticated")
                return
            }

            if (!message.trim()) {
                set({ commentError: "Comment cannot be empty" })
                return
            }

            const { error } = await supabase
                .from("comments")
                .insert({
                    project_id,
                    user_id: userId,
                    message: message.trim()
                })

            if (error) {
                console.error("Failed to send comment:", error.message)
                set({ commentError: error.message })
                toast.error(error.message)
                return
            }

            set({ commentError: null })
        } catch (err: any) {
            console.error("sendComment failed:", err.message)
            set({ commentError: err.message })
            toast.error(err.message)
        } finally {
            set({ commentLoading: false })
        }
    },

    subscribeToComments: (project_id) => {
        if (commentChannel) supabase.removeChannel(commentChannel)

        commentChannel = supabase
            .channel(`comments-${project_id}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "comments",
                filter: `project_id=eq.${project_id}`
            }, (payload) => {
                const newComment = payload.new as CommentType

                set((state) => {
                    if (state.comments.some((comment) => comment.id === newComment.id)) return state
                    return { comments: [...state.comments, newComment] }
                })
            })
            .subscribe((status) => {
                if (status === "CHANNEL_ERROR") {
                    console.error("Comments Realtime subscription failed")
                    toast.error("Failed to connect to comments")
                }
            })
    },

    unsubscribeFromComments: () => {
        if (commentChannel) {
            supabase.removeChannel(commentChannel)
            commentChannel = null
        }
    }
}))
