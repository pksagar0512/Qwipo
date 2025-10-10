import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function loadCart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem("cart", JSON.stringify(cart)); window.dispatchEvent(new Event("cart-updated")); } catch {}
}

export default function CartPanel() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(loadCart());
  useEffect(() => {
    const onUpdate = () => setCart(loadCart());
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  const removeItem = (index) => {
    const c = [...cart];
    c.splice(index, 1);
    saveCart(c);
    setCart(c);
  };

  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const gst = +(subtotal * 0.07);
  const total = +(subtotal + gst);

  const handleCheckout = () => {
    // For demo: open the checkout modal in BrandProducts (or simulate)
    // You can navigate to a dedicated checkout page if you created one:
    navigate("/profile"); // keep user on profile; BrandProducts uses a simulated flow
    window.dispatchEvent(new CustomEvent("open-payment", { detail: { cart } }));
  };

  if (!cart.length) {
    return (
      <div className="bg-gray-900 p-4 rounded-xl shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center font-bold">🛒</div>
          <div>
            <div className="font-semibold">Your Cart</div>
            <div className="text-xs text-gray-400">No items yet</div>
          </div>
        </div>
        <div className="mt-3 text-sm">
          <button onClick={() => navigate("/brand-products")} className="px-3 py-1 bg-emerald-600 rounded">Browse Products</button>
          <button onClick={() => navigate("/orders")} className="ml-2 px-3 py-1 bg-gray-700 rounded">Order History</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center font-bold">🛒</div>
        <div>
          <div className="font-semibold">Cart ({cart.length})</div>
          <div className="text-xs text-gray-400">Tap an item to edit in product view</div>
        </div>
      </div>

      <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-gray-800 p-2 rounded">
            <div className="flex items-center gap-3">
              <img src={item.image || "/default-logo.png"} alt={item.name} className="w-12 h-12 object-cover rounded" />
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-gray-400">
                  {item.selectedColor ? `${item.selectedColor}` : ""}{item.selectedColor && item.selectedSize ? " | " : ""}{item.selectedSize ? `${item.selectedSize}` : ""}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">₹{(item.price || 0).toFixed(2)}</div>
              <div className="text-xs text-gray-400">Qty: {item.quantity || 1}</div>
              <button onClick={() => removeItem(idx)} className="mt-1 text-xs text-red-400">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-800 pt-3">
        <div className="flex justify-between text-sm text-gray-400">
          <div>Subtotal</div>
          <div>₹{subtotal.toFixed(2)}</div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <div>GST (7%)</div>
          <div>₹{gst.toFixed(2)}</div>
        </div>
        <div className="flex justify-between font-semibold text-emerald-400 mt-2">
          <div>Total</div>
          <div>₹{total.toFixed(2)}</div>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={handleCheckout} className="flex-1 px-3 py-2 bg-emerald-600 rounded">Proceed to Payment</button>
          <button onClick={() => navigate("/orders")} className="px-3 py-2 bg-gray-700 rounded">History</button>
        </div>
      </div>
    </div>
  );
}
