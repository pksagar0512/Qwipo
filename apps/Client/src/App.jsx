import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Blogs from "./pages/Blogs.jsx";
import Career from "./pages/Career.jsx";
import Partners from "./pages/Partners.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx"; 
import BrandProducts from "./pages/BrandProducts.jsx";
import ManufacturerDashboard from "./pages/ManufacturerDashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
        <Route path="/blogs" element={<MainLayout><Blogs /></MainLayout>} />
        <Route path="/career" element={<MainLayout><Career /></MainLayout>} />
        <Route path="/partners" element={<MainLayout><Partners /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

        <Route
          path="/manufacturer-dashboard"
          element={<MainLayout><ManufacturerDashboard /></MainLayout>}
        />
        <Route
          path="/profile"
          element={<MainLayout><Profile /></MainLayout>}
        />

        <Route path="/brand/:brandName" element={<MainLayout><BrandProducts /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
