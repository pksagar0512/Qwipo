import React, { useEffect, useState } from "react";

function loadCart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}
function saveCart(cart) { try { localStorage.setItem("cart", JSON.stringify(cart)); window.dispatchEvent(new Event("cart-updated")); } catch {} }

export default function CartPanel() {
  const [cart, setCart] = useState(loadCart());
  const gstRate = 0.07;

  useEffect(() => {
    const handler = () => setCart(loadCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  const removeItem = (index) => {
    const c = [...cart]; c.splice(index,1); setCart(c); saveCart(c);
  };

  const subtotal = cart.reduce((s,i)=> s + (i.price || 0) * (i.quantity || 0), 0);
  const gst = +(subtotal * gstRate);
  const total = +(subtotal + gst);

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-lg font-bold text-amber-400">🛒</div>
        <div>
          <div className="text-sm text-gray-400">Your Cart</div>
          <div className="font-semibold">{cart.length} items</div>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-auto">
        {cart.length === 0 && <div className="text-gray-400">Cart is empty</div>}
        {cart.map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-gray-900 p-2 rounded">
            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-400">{item.selectedColor} / {item.selectedSize}</div>
              <div className="text-sm text-gray-200 mt-1">Qty: {item.quantity}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">₹{item.price}</div>
              <button onClick={() => removeItem(i)} className="text-red-400 text-sm mt-2">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-700 pt-3">
        <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-gray-400"><span>GST (7%)</span><span>₹{gst.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

        <div className="mt-3 flex flex-col gap-2">
          <button onClick={() => alert("Proceed to payment — implement gateway")} className="px-4 py-2 bg-emerald-600 rounded">Proceed to Payment</button>
          <button onClick={() => { setCart([]); saveCart([]); }} className="px-4 py-2 bg-gray-700 rounded">Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
