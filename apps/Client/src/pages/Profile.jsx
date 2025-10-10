import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import Brands from "./Brands";
import BrandProducts from "./BrandProducts";
import CartPanel from "../components/CartPanel";

export default function Profile() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const userName = user.name || "Retailer";
  const token = user.token || "";
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [openProduct, setOpenProduct] = useState(location.state?.openProduct || null);

  useEffect(() => {
    if (location.state?.openProduct) {
      setOpenProduct(location.state.openProduct);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setOrders(json || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* give header space so content won't hide behind navbar */}
      <div className="pt-28 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome, <span className="text-emerald-400">{userName}</span></h1>
            <p className="text-gray-400">Retailer dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="px-3 py-1 rounded bg-gray-800">Home</button>
            <button onClick={() => { localStorage.removeItem("user"); navigate("/login"); }} className="px-3 py-1 rounded bg-gray-700">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Brands token={token} category={user.category || user.retailerType} />
            <div className="mt-6">
              <Routes>
                <Route path="/brand/:brandName" element={<BrandProducts openProduct={openProduct} onOpenProduct={setOpenProduct} />} />
                <Route path="/brand-products" element={<BrandProducts openProduct={openProduct} onOpenProduct={setOpenProduct} />} />
              </Routes>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <CartPanel />
              <div className="mt-6 bg-gray-900 p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-3">Order History</h3>
                {orders.length === 0 ? (
                  <div className="text-gray-400">No orders yet</div>
                ) : (
                  orders.map((o) => (
                    <div key={o._id} className="bg-gray-800 p-3 rounded mb-3">
                      <div className="font-semibold">Invoice #{o.billNumber || o._id}</div>
                      <div className="text-sm text-gray-400">{new Date(o.createdAt).toLocaleString()}</div>
                      <div className="text-sm mt-1">Total: ₹{(o.total || 0).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
