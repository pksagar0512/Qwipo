import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isProfilePage = location.pathname === "/profile";

  return (
    <nav className="w-full bg-gray-950 text-gray-300 px-6 py-4 flex justify-between items-center shadow-md fixed top-0 z-50">
      <div className="text-2xl font-bold text-purple-400">Qwipo</div>
      <div className="flex gap-6 items-center">
        {isProfilePage ? (
          <>
            <span className="text-green-400">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="border px-4 py-2 rounded border-red-500 hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/career">Career</Link>
            <Link to="/partners">Partners</Link>
            <Link to="/contact">Contact</Link>
            {user ? (
              <>
                <span className="text-green-400">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="border px-4 py-2 rounded border-red-500 hover:bg-red-600 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="border px-4 py-2 rounded border-purple-500">Login</Link>
                <Link to="/register" className="bg-emerald-500 px-4 py-2 rounded">Register</Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;