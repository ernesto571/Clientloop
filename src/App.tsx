import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Home/Navbar";
import HomePage from "./pages/Homepage";
import { useEffect } from "react";
import { supabase } from "./lib/supabase-client";
import { useAuthStore } from "./store/AuthStore";
import Overview from "./pages/freelancer/Overview";
import Clients from "./pages/freelancer/Clients";

interface RouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { session, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!session) {
      return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {

//   const { fetchSession } = useAuthStore()
//   const { fetchWishlistItems } = useWishlistStore()
//   const { fetchCartItems } = useCartStore()
//   const { fetchAllProducts } = useProductStore()

//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//           useAuthStore.setState({ session });
  
//           if (session) {
//               setTimeout(() => {
//                   void useCartStore.getState().migrateCartToDatabase();
//                   void useWishlistStore.getState().migrateWishlistToDatabase();
//               }, 0);
//           }
//       }
//     );

//     const initializeApp = async () => {
//         console.log("Fetching session...");

//         await fetchSession();

//         await fetchAllProducts()

//         console.log("Fetching wishlist...");
//         await fetchWishlistItems();

//         console.log("Fetching cart...");
//         await fetchCartItems();
//     };

//     initializeApp();

//     return () => {
//         authListener.subscription.unsubscribe();
//     };
// }, []);
  useEffect(() => {
      const { data } = supabase.auth.onAuthStateChange((_e, session) => useAuthStore.setState({ session }))
      return () => data.subscription.unsubscribe()
  }, [])

  return (
    <>
      <main>
      <Routes>
       
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />

        {/* <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all" element={<AllProducts />} />
        <Route path="/apparel" element={<Apparel />} />
        <Route path="/footwear" element={<Footwear />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/tech" element={<Tech />} />
        <Route path="/my-wishlist" element={<Wishlist />} />
        <Route path="/:slug" element={<ProductDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/successful" element={<Successful />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />  */}

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