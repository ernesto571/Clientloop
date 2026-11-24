
import { create } from "zustand";
import { supabase } from "../lib/supabase-client";

interface Profile {
    name: string;
    email: string;
    business_name: string;
    created_at: string | number;
}

interface FormData {
    name: string;
    email: string;
    business_name?: string;
}

interface ProfileStore {
    profile: Profile | null;
    profileFormData: FormData;
    profileLoading: boolean;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: FormData) => Promise<void>;
    deleteAccount: () => Promise<void>;
    setProfileFormData: (data: Partial<FormData>) => void;
}

const initialFormData: FormData = {
    name: "",
    email: "",
    business_name: "",
};

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    profileLoading: false,
    profileFormData: initialFormData,

    fetchProfile: async () => {
        set({ profileLoading: true });

        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) throw error;
            if (!user) {
                set({ profile: null });
                return;
            }

            const profile = {
                name: user.user_metadata?.full_name  ?? "",
                email: user.email ?? "",
                business_name: user.user_metadata?.business_name ?? "",
                created_at: user.created_at,
            };

            set({
                profile,
                profileFormData: {
                    name: profile.name,
                    email: profile.email,
                    business_name: profile.business_name,
                },
            });
        } catch (err: unknown) {
            console.error(
                "Fetch profile failed:",
                err instanceof Error ? err.message : err
            );
        } finally {
            set({ profileLoading: false });
        }
    },

    updateProfile: async (data) => {
        set({ profileLoading: true });

        try {
            const { data: { user }, error } =
                await supabase.auth.updateUser({
                    email: data.email,
                    data: {
                        full_name: data.name,
                        business_name: data.business_name
                    },
                });

            if (error) throw error;
            if (!user) return;

            const profile = {
                name: user.user_metadata?.full_name ?? "",
                email: user.email ?? "",
                business_name: user.user_metadata?.business_name ?? "",
                created_at: user.created_at,
            };

            set({
                profile,
                profileFormData: {
                    name: profile.name,
                    email: profile.email,
                    business_name: profile.business_name,
                },
            });

            console.log("Profile updated successfully");
        } catch (err: unknown) {
            console.error(
                "Update profile failed:",
                err instanceof Error ? err.message : err
            );
        } finally {
            set({ profileLoading: false });
        }
    },

    deleteAccount: async () => {
        set({ profileLoading: true });

        try {
            // Calls a secure Supabase Edge Function.
            const { error } = await supabase.functions.invoke(
                "delete-account"
            );

            if (error) throw error;

            await supabase.auth.signOut({ scope: "local" });

            set({
                profile: null,
                profileFormData: initialFormData,
            });

            console.log("Account deleted successfully");
        } catch (err: unknown) {
            console.error(
                "Delete account failed:",
                err instanceof Error ? err.message : err
            );
        } finally {
            set({ profileLoading: false });
        }
    },

    setProfileFormData: (data) =>
        set((state) => ({
            profileFormData: {
                ...state.profileFormData,
                ...data,
            },
        })),
}));
