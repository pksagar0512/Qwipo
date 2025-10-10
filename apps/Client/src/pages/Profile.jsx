import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import Brands from "./Brands";
import BrandProducts from "./BrandProducts";
import CartPanel from "../components/CartPanel";
import QwiChat from "../components/QwiChat";


function formatDateTime(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}
function orderTimestamp(o) {
  return new Date(o.createdAt || o.created_at || o.updatedAt || o.updated_at || Date.now());
}
function parseStart(dateStr) { if(!dateStr) return null; return new Date(dateStr + "T00:00:00"); }
function parseEnd(dateStr) { if(!dateStr) return null; return new Date(dateStr + "T23:59:59.999"); }

export default function Profile() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const userName = user.name || "Retailer";
  const token = user.token || "";
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [openProduct, setOpenProduct] = useState(location.state?.openProduct || null);

  useEffect(() => {
    if (location.state?.openProduct) setOpenProduct(location.state.openProduct);
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) { setOrders([]); setLoadingOrders(false); return; }
      setLoadingOrders(true);
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setOrders(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [token]);

  // --- Order filter state (sidebar) ---
  const todayIso = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(todayIso);
  const [filterApplied, setFilterApplied] = useState(false); // NEW → hide until filter

  function applyFilter() {
    setFilterApplied(true);
    if (!startDate && !endDate) {
      setFilteredOrders([]);
      return;
    }
    const s = parseStart(startDate);
    const e = parseEnd(endDate);
    const f = orders.filter(o => {
      const t = orderTimestamp(o);
      if (!t || isNaN(t.getTime())) return false;
      if (s && t < s) return false;
      if (e && t > e) return false;
      return true;
    });
    setFilteredOrders(f);
  }

  function resetFilter() {
    setStartDate("");
    setEndDate(todayIso);
    setFilteredOrders([]);
    setFilterApplied(false);
  }

  function downloadInvoice(order) {
    const w = window.open("", "_blank", "width=900,height=800");
    if (!w) return alert("Popup blocked — allow popups for this site.");
    const html = `
      <html><head><title>Invoice ${order.billNumber || order._id}</title></head>
      <body style="font-family:sans-serif;padding:20px">
      <h2>Qwipo Invoice</h2>
      <div>Invoice #${order.billNumber || order._id}</div>
      <div>Date: ${formatDateTime(order.createdAt)}</div>
      <hr/>
      ${(order.items || order.cart || []).map(it =>
        `<div>${it.name} | Qty: ${it.quantity || 1} | ₹${it.price}</div>`
      ).join("")}
      <h3>Total: ₹${(order.total||0).toFixed(2)}</h3>
      <script>setTimeout(()=>window.print(),200)</script>
      </body></html>`;
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
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

          {/* --- ORDER SIDEBAR --- */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <CartPanel />

              <div className="mt-6 bg-gray-900 p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-3">Order History</h3>

                {/* FILTER BAR */}
                <div className="flex flex-col gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-300">From</label>
                    <input type="date" className="px-2 py-1 rounded bg-gray-800 text-white" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <label className="text-sm text-gray-300 ml-2">To</label>
                    <input type="date" className="px-2 py-1 rounded bg-gray-800 text-white" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={applyFilter} className="px-3 py-1 bg-emerald-600 rounded">Filter</button>
                    <button onClick={resetFilter} className="px-3 py-1 bg-gray-700 rounded">Reset</button>
                  </div>
                </div>

                {/* ORDER LIST */}
                <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                  {loadingOrders ? (
                    <div className="text-gray-400">Loading...</div>
                  ) : !filterApplied ? (
                    <div className="text-gray-400">Select a date range to view orders.</div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-gray-400">No orders found in this range.</div>
                  ) : (
                    filteredOrders.map(o => (
                      <div key={o._id} className="bg-gray-800 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">Invoice #{o.billNumber || o._id}</div>
                            <div className="text-xs text-gray-400">{formatDateTime(orderTimestamp(o))}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-emerald-400">₹{(o.total||0).toFixed(2)}</div>
                            <button onClick={() => downloadInvoice(o)} className="text-xs bg-emerald-600 px-2 py-1 rounded mt-1">Download</button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {(o.items || o.cart || []).slice(0,2).map((it,i)=>
                            <div key={i}>• {it.name} × {it.quantity||1}</div>
                          )}
                          {(o.items||o.cart||[]).length > 2 && <div className="text-xs text-gray-500">+{(o.items||o.cart||[]).length - 2} more</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60 }}>
  <QwiChat token={token} />
</div>

    </div>
  );
}
