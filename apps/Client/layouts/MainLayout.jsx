import Navbar from "../src/components/Navbar.jsx";
import Footer from "../src/components/Footers.jsx";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-8 px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;