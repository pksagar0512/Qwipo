import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../src/components/Navbar.jsx";
import Footer from "../src/components/Footers.jsx";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const protectedRoutes = ["/manufacturer-dashboard", "/profile"];
    const currentPath = window.location.pathname;

    // redirect if no user and trying to access a protected route
    if (!user && protectedRoutes.includes(currentPath)) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 px-6">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
