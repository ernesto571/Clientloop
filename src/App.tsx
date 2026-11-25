import React, { useState } from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/Homepage";
import { useEffect } from "react";
import { supabase } from "./lib/supabase-client";
import Overview from "./pages/freelancer/Overview";
import Clients from "./pages/freelancer/Clients";
import Projects from "./pages/freelancer/Projects";
import ProjectDetails from "./pages/freelancer/ProjectDetails";
import Invoices from "./pages/freelancer/Invoices";
import Notifications from "./pages/freelancer/Notifications";
import AcceptInvite from "./pages/AcceptInvite";
import AuthListener from "./hooks/AuthListener";
import Settings from "./pages/freelancer/Settings ";
import ClientProject from "./pages/client/ClientProject";

interface Props {
  children: React.ReactNode
  role: "freelancer" | "client"
}

const RoleRoute = ({ children, role }: Props) => {
  const [checking, setChecking] = useState(true)
  const [redirect, setRedirect] = useState<string | null>(null)

  useEffect(() => {
    const check = async () => {
      // get the session directly from Supabase
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setRedirect("/")
        setChecking(false)
        return
      }

      const { data: user, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()
      if (error) console.error("Role check failed:", error.message)

      if (!user?.role) {
        setRedirect("/")
      } else if (user.role !== role) {
        setRedirect(user.role === "client" ? "/client/project" : "/overview")
      } else if (role === "client") {
        const { data: clients } = await supabase.from("clients").select("status").eq("user_id", session.user.id)
        const isActive = !!clients?.some((c) => c.status === "Active")
        if (!isActive) setRedirect("/client/accept-invite")
      }

      setChecking(false)
    }

    check()
  }, [role])

  if (checking) return null
  if (redirect) return <Navigate to={redirect} replace />

  return <>{children}</>
}

// For public pages (homepage, client sign in):
// signed-out visitors see the page, signed-in users go to their own area.
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true)
  const [redirect, setRedirect] = useState<string | null>(null)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setChecking(false)
        return
      }

      const { data: user, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()
      if (error) console.error("Role check failed:", error.message)

      if (user?.role === "freelancer") {
        setRedirect("/overview")
      } else if (user?.role === "client") {
        const { data: clients } = await supabase.from("clients").select("status").eq("user_id", session.user.id)
        const isActive = !!clients?.some((c) => c.status === "Active")
        setRedirect(isActive ? "/client/project" : "/client/accept-invite")
      }

      setChecking(false)
    }

    check()
  }, [])

  if (checking) return null
  if (redirect) return <Navigate to={redirect} replace />

  return <>{children}</>
}

export const FreelancerRoute = ({ children }: { children: React.ReactNode }) => <RoleRoute role="freelancer">{children}</RoleRoute>
export const ClientRoute = ({ children }: { children: React.ReactNode }) => <RoleRoute role="client">{children}</RoleRoute>

function App() {

  return (
    <>
    <AuthListener />
      <main>
      <Routes>
       
        <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
        <Route path="/client/accept-invite" element={<AcceptInvite />} />
        <Route path="/overview" element={<FreelancerRoute><Overview /></FreelancerRoute>} />
        <Route path="/clients" element={<FreelancerRoute><Clients /></FreelancerRoute>} />
        <Route path="/projects" element={<FreelancerRoute><Projects /></FreelancerRoute>} />
        <Route path="/projects/:id" element={<FreelancerRoute><ProjectDetails /></FreelancerRoute>} />
        <Route path="/invoices" element={<FreelancerRoute><Invoices /></FreelancerRoute>} />
        <Route path="/notifications" element={<FreelancerRoute><Notifications /></FreelancerRoute>} />
        <Route path="/settings" element={<FreelancerRoute><Settings /></FreelancerRoute>} />

        <Route path="/client/project" element={<ClientRoute><ClientProject /></ClientRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />


      </Routes>
      </main>
      
      <Toaster
        position="bottom-center"
        toastOptions={{
            duration: 4000,
            style: {
                background: "#fff",
                color: "#0a0a0a",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 500,
                padding: "12px 16px",
                boxShadow: "0 4px 12px rgba(0,0,0,.06)",
            },
            success: { iconTheme: { primary: "#0a0a0a", secondary: "#fff" } },
            error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
        }}
      />
    </>
  );
}

export default App;