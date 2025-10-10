import React, { useEffect, useState } from "react";

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// helper: get a Date object for the order timestamp (try many fields)
function orderTimestamp(order) {
  return new Date(order.createdAt || order.created_at || order.updatedAt || order.updated_at || order.date || order.timestamp || Date.now());
}

// helper: parse yyyy-mm-dd into Date start (00:00:00) and end (23:59:59)
function parseDateStart(dateStr) {
  if (!dateStr) return null;
  // treat as local date start
  return new Date(dateStr + "T00:00:00");
}
function parseDateEnd(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + "T23:59:59.999");
}

export default function OrderHistory() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const token = user?.token || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayIso = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(todayIso);

  const [filtered, setFiltered] = useState([]);
  const [debugInfo, setDebugInfo] = useState({ earliest: null, latest: null });

  // toggle: set to true to ask server to filter (requires backend change). Default false.
  const [useServerFilter, setUseServerFilter] = useState(false);

  useEffect(() => {
    // initial fetch (all orders)
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchOrders(params = {}) {
    setLoading(true);
    try {
      // if server filter requested and start/end present, add params
      let url = "/api/orders/my-orders";
      if (useServerFilter && (params.start || params.end)) {
        const q = new URLSearchParams();
        if (params.start) q.set("start", params.start);
        if (params.end) q.set("end", params.end);
        url += "?" + q.toString();
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("Failed to fetch orders", res.status);
        setOrders([]);
        setFiltered([]);
        setLoading(false);
        return;
      }
      const json = await res.json();
      const arr = Array.isArray(json) ? json : (json?.orders || json?.data || []);
      setOrders(arr || []);
      setFiltered(arr || []);
      updateDebugDates(arr || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }

  function updateDebugDates(arr) {
    if (!arr || arr.length === 0) {
      setDebugInfo({ earliest: null, latest: null });
      return;
    }
    const timestamps = arr.map(orderTimestamp).map(d => d.getTime()).filter(Boolean).sort((a,b)=>a-b);
    setDebugInfo({
      earliest: timestamps.length ? new Date(timestamps[0]).toISOString() : null,
      latest: timestamps.length ? new Date(timestamps[timestamps.length-1]).toISOString() : null,
    });
  }

  function applyClientFilter() {
    // parse dates
    const s = parseDateStart(startDate);
    const e = parseDateEnd(endDate);

    // if both empty, just set filtered=orders
    if (!s && !e) {
      setFiltered(orders);
      return;
    }

    const f = orders.filter(o => {
      const t = orderTimestamp(o);
      if (!t || isNaN(t.getTime())) return false;
      if (s && t < s) return false;
      if (e && t > e) return false;
      return true;
    });
    setFiltered(f);
  }

  async function handleFilterClick() {
    if (useServerFilter) {
      // send params to server (server must support start & end as YYYY-MM-DD)
      await fetchOrders({ start: startDate || undefined, end: endDate || undefined });
    } else {
      applyClientFilter();
    }
  }

  function resetFilters() {
    setStartDate("");
    setEndDate(todayIso);
    setFiltered(orders);
  }

  function downloadInvoice(order) {
    const w = window.open("", "_blank", "width=900,height=800");
    if (!w) return alert("Popup blocked — allow popups for this site to download invoice.");
    const html = `
      <html>
      <head><title>Invoice ${order.billNumber || order._id}</title></head>
      <body>
        <pre>${JSON.stringify(order, null, 2)}</pre>
        <script>setTimeout(()=>window.print(),200)</script>
      </body>
      </html>
    `;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="pt-8 px-6 pb-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order History</h1>
          <p className="text-gray-400">Filter by date range (select From and To then click Filter)</p>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-300 flex items-center gap-2">
            <input type="checkbox" checked={useServerFilter} onChange={(e)=>setUseServerFilter(e.target.checked)} />
            Server-side filter
          </label>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-300">From</label>
          <input type="date" className="px-3 py-1 rounded bg-gray-700 text-white" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-300">To</label>
          <input type="date" className="px-3 py-1 rounded bg-gray-700 text-white" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
        </div>

        <div className="ml-auto flex gap-2">
          <button onClick={handleFilterClick} className="px-3 py-1 bg-emerald-600 rounded">Filter</button>
          <button onClick={resetFilters} className="px-3 py-1 bg-gray-700 rounded">Reset</button>
        </div>
      </div>

      <div className="mb-3 text-sm text-gray-400">
        Showing {filtered.length} of {orders.length} orders.
        <div>Debug earliest order: {debugInfo.earliest ? new Date(debugInfo.earliest).toLocaleString() : "—"} | latest: {debugInfo.latest ? new Date(debugInfo.latest).toLocaleString() : "—"}</div>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400 p-6 bg-gray-900 rounded">No orders found in this range.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div key={o._id} className="bg-gray-900 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-4">
                  <div className="font-semibold">Invoice #{o.billNumber || o._id}</div>
                  <div className="text-sm text-gray-400">| {formatDateTime(orderTimestamp(o))}</div>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Items: {(o.items || o.cart || []).length} • Buyer: {o.buyerName || o.buyer || "—"}
                </div>
                <div className="mt-2">
                  {(o.items || o.cart || []).slice(0, 4).map((it, i) => (
                    <div key={i} className="text-sm text-gray-300">• {it.name} {it.selectedColor ? `| ${it.selectedColor}` : ""} {it.selectedSize ? `| ${it.selectedSize}` : ""} × {it.quantity || 1}</div>
                  ))}
                  { (o.items || o.cart || []).length > 4 && <div className="text-xs text-gray-500 mt-1">+ { (o.items||o.cart||[]).length - 4 } more items</div> }
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="font-semibold text-emerald-400">₹{(o.total || 0).toFixed(2)}</div>
                <div className="flex gap-2">
                  <button onClick={() => downloadInvoice(o)} className="px-3 py-1 bg-emerald-600 rounded">Download Invoice</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
