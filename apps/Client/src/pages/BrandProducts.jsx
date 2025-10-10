import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function loadCart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem("cart", JSON.stringify(cart)); window.dispatchEvent(new Event("cart-updated")); } catch {}
}

export default function BrandProducts({ onOpenProduct }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { brandName } = useParams();
  const brandFromState = location.state?.brand;
  const brandKey = brandName || brandFromState?.brandName || brandFromState?.name || null;

  const [brand, setBrand] = useState(brandFromState || (brandKey ? { brandName: brandKey } : null));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [quantities, setQuantities] = useState({});

  const [recommendations, setRecommendations] = useState([]);
  const [recDebug, setRecDebug] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const token = (() => { try { const u = JSON.parse(localStorage.getItem("user")||"null"); return u?.token || ""; } catch { return ""; }})();

  useEffect(() => {
    if (brandFromState && !brandFromState.brandName && brandName) {
      setBrand({ ...brandFromState, brandName });
    }
  }, [brandFromState, brandName]);

  useEffect(() => {
    if (!brandKey) { setLoading(false); return; }
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products?brand=${encodeURIComponent(brandKey)}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length) setProducts(data);
        else {
          const res2 = await fetch(`http://localhost:5000/api/products/brand/${encodeURIComponent(brandKey)}`);
          const data2 = await res2.json();
          setProducts(Array.isArray(data2) ? data2 : []);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, [brandKey]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedPairs([]);
    setQuantities({});
    fetchRecommendations(product.name);
    if (onOpenProduct) onOpenProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchRecommendations = async (productName) => {
    setRecommendations([]);
    setRecDebug(null);
    if (!productName) return;
    try {
      const res = await fetch(`http://localhost:5000/api/recommendations/${encodeURIComponent(productName)}`);
      const json = await res.json();
      setRecDebug(json);
      const list = Array.isArray(json) ? json : (json?.recommendations || json?.data || []);
      setRecommendations(list);
    } catch (err) {
      console.warn("Recommendation fetch failed:", err);
      setRecDebug({ error: String(err) });
    }
  };

  const addPair = (color, size) => {
    if (!color || !size) return alert("Select color & size first");
    const key = `${color}-${size}`;
    if (selectedPairs.find(p => p.color===color && p.size===size)) return;
    setSelectedPairs(prev => [...prev, { color, size }]);
    setQuantities(prev => ({ ...prev, [key]: prev[key] || 5 }));
  };
  const changeQty = (color, size, v) => {
    let q = parseInt(v) || 5; if (q < 5) q = 5; q = Math.round(q/5)*5;
    setQuantities(prev => ({ ...prev, [`${color}-${size}`]: q }));
  };
  const removePair = (color, size) => {
    setSelectedPairs(prev => prev.filter(p => !(p.color===color && p.size===size)));
    setQuantities(prev => { const c = {...prev}; delete c[`${color}-${size}`]; return c; });
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    if (selectedProduct.category === "Clothing" && !selectedPairs.length) return alert("Select at least one color/size pair");
    if (selectedProduct.category !== "Clothing" && Object.keys(quantities).length === 0) {
      const item = {
        _id: selectedProduct._id,
        name: selectedProduct.name,
        image: selectedProduct.image,
        price: selectedProduct.price,
        selectedColor: selectedColor || null,
        selectedSize: selectedSize || null,
        quantity: 1,
        brand: selectedProduct.brand
      };
      const cart = loadCart();
      cart.push(item);
      saveCart(cart);
      alert("Added to cart");
      return;
    }
    const cart = loadCart();
    const items = selectedPairs.map(({color,size}) => ({
      _id: selectedProduct._id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      price: selectedProduct.price,
      selectedColor: color,
      selectedSize: size,
      quantity: quantities[`${color}-${size}`] || 5,
      brand: selectedProduct.brand
    }));
    const updated = [...cart, ...items];
    saveCart(updated);
    alert("Added to cart");
  };

  const handleRecommendationClick = async (rec) => {
    if (!rec) return;
    if (rec._id) {
      openModal(rec);
      return;
    }
    try {
      const byName = typeof rec === "string" ? rec : rec.productName || rec.name;
      if (!byName) return alert("Recommendation has no usable product name");
      const res = await fetch(`http://localhost:5000/api/products?name=${encodeURIComponent(byName)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length) openModal(data[0]);
      else {
        const found = products.find(p => p.name.toLowerCase() === String(byName).toLowerCase());
        if (found) openModal(found);
        else alert("Recommended product not available as detailed product.");
      }
    } catch (err) {
      console.error("Failed to open recommendation:", err);
    }
  };

  const tryPaymentAndCreateOrder = async () => {
    const cart = loadCart();
    if (!cart.length) return alert("Cart empty");
    setShowPaymentModal(false);
    setPlacingOrder(true);
    const subtotal = cart.reduce((s,i) => s + (i.price||0) * (i.quantity||1), 0);
    const gst = +(subtotal * 0.07);
    const total = +(subtotal + gst);
    const billNumber = Math.floor(100000 + Math.random() * 900000);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cart, subtotal, gst, total, billNumber })
      });
      if (!res.ok) throw new Error("Order failed");
      const json = await res.json();
      alert("Payment simulated. Order placed.");
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      setPlacingOrder(false);
      navigate("/profile");
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Order failed: " + (err.message || "server error"));
      setPlacingOrder(false);
    }
  };

  const renderOptionsByCategory = (product) => {
    const cat = product?.category || "";
    if (cat === "Clothing") {
      const colors = (product.colors && product.colors.length) ? product.colors : ["Red","Blue","Green","Black","White"];
      const sizes = (product.sizes && product.sizes.length) ? product.sizes : ["S","M","L","XL","XXL"];
      return (
        <>
          <div className="mt-4">
            <div className="font-semibold mb-2">Select Color</div>
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => <button key={c} onClick={() => setSelectedColor(c)} className={`px-3 py-1 rounded ${selectedColor===c ? "bg-emerald-600" : "bg-gray-700"}`}>{c}</button>)}
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-2">Select Size</div>
            <div className="flex gap-2 flex-wrap">
              {sizes.map(s => <button key={s} onClick={() => setSelectedSize(s)} className={`px-3 py-1 rounded ${selectedSize===s ? "bg-emerald-600" : "bg-gray-700"}`}>{s}</button>)}
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => addPair(selectedColor, selectedSize)} className="px-4 py-2 bg-blue-600 rounded">Add Pair</button>
          </div>
        </>
      );
    }
    if (cat === "Electrical") {
      const voltages = product.voltages || ["110V","220V","240V"];
      const warranties = product.warranties || ["6 months","1 year","2 years"];
      return (
        <>
          <div className="mt-4">
            <div className="font-semibold mb-2">Voltage</div>
            <div className="flex gap-2 flex-wrap">
              {voltages.map(v => <button key={v} onClick={() => setSelectedColor(v)} className={`px-3 py-1 rounded ${selectedColor===v ? "bg-emerald-600" : "bg-gray-700"}`}>{v}</button>)}
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-2">Warranty</div>
            <div className="flex gap-2 flex-wrap">
              {warranties.map(w => <button key={w} onClick={() => setSelectedSize(w)} className={`px-3 py-1 rounded ${selectedSize===w ? "bg-emerald-600" : "bg-gray-700"}`}>{w}</button>)}
            </div>
          </div>
        </>
      );
    }
    if (cat === "Furniture") {
      const materials = product.materials || ["Wood","Metal","MDF","Glass"];
      const dims = product.dimensions || ["Small","Medium","Large"];
      return (
        <>
          <div className="mt-4">
            <div className="font-semibold mb-2">Material</div>
            <div className="flex gap-2 flex-wrap">
              {materials.map(m => <button key={m} onClick={() => setSelectedColor(m)} className={`px-3 py-1 rounded ${selectedColor===m ? "bg-emerald-600" : "bg-gray-700"}`}>{m}</button>)}
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-2">Dimensions</div>
            <div className="flex gap-2 flex-wrap">
              {dims.map(d => <button key={d} onClick={() => setSelectedSize(d)} className={`px-3 py-1 rounded ${selectedSize===d ? "bg-emerald-600" : "bg-gray-700"}`}>{d}</button>)}
            </div>
          </div>
        </>
      );
    }
    if (cat === "Mobile Accessories") {
      const compat = product.compatibility || ["Universal","iOS","Android"];
      return (
        <>
          <div className="mt-4">
            <div className="font-semibold mb-2">Compatibility</div>
            <div className="flex gap-2 flex-wrap">
              {compat.map(c => <button key={c} onClick={() => setSelectedColor(c)} className={`px-3 py-1 rounded ${selectedColor===c ? "bg-emerald-600" : "bg-gray-700"}`}>{c}</button>)}
            </div>
          </div>
          <div className="mt-4">
            <div className="font-semibold mb-2">Color</div>
            <div className="flex gap-2 flex-wrap">
              {(product.colors && product.colors.length ? product.colors : ["Black","White","Blue"]).map(c => <button key={c} onClick={() => setSelectedSize(c)} className={`px-3 py-1 rounded ${selectedSize===c ? "bg-emerald-600" : "bg-gray-700"}`}>{c}</button>)}
            </div>
          </div>
        </>
      );
    }
    if (cat === "Cosmetics") {
      const shades = product.shades || ["Light","Medium","Dark"];
      return (
        <>
          <div className="mt-4">
            <div className="font-semibold mb-2">Shade</div>
            <div className="flex gap-2 flex-wrap">
              {shades.map(s => <button key={s} onClick={() => setSelectedColor(s)} className={`px-3 py-1 rounded ${selectedColor===s ? "bg-emerald-600" : "bg-gray-700"}`}>{s}</button>)}
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="mt-4 text-gray-400">No specific options for this category. Use Add to Cart to buy.</div>
    );
  };

  return (
    <div className="pt-8 px-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{brandKey}</h1>
          <p className="text-gray-400">{brand?.category || ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-3 py-1 bg-gray-800 rounded">Back</button>
        </div>
      </div>

      {loading ? <div className="text-gray-400">Loading...</div> : (
        products.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p._id} className="p-4 bg-gray-800 rounded-xl shadow hover:scale-105 transition cursor-pointer" onClick={() => openModal(p)}>
                <img src={p.image} alt={p.name} className="w-full h-52 object-cover rounded mb-3" />
                <div className="flex justify-between items-baseline">
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <div className="text-emerald-400 font-bold">₹{p.price}</div>
                </div>
                <p className="text-sm text-gray-400 mt-1">{p.description?.slice(0,80) || ""}</p>
              </div>
            ))}
          </div>
        ) : <div className="text-gray-400">No products found.</div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl p-6 z-60">
            <div className="flex gap-6 md:gap-8">
              <img src={selectedProduct.image} alt="" className="w-1/3 h-80 object-cover rounded" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                    <p className="text-gray-400 mt-1">{selectedProduct.description}</p>
                    <div className="mt-3 text-xl font-semibold">₹{selectedProduct.price}</div>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="px-3 py-1 bg-gray-700 rounded">Close</button>
                </div>

                {renderOptionsByCategory(selectedProduct)}

                <div className="mt-4">
                  <div className="font-semibold mb-2">Selected Pairs / Options</div>
                  {selectedProduct.category === "Clothing" ? (
                    selectedPairs.length === 0 ? <div className="text-gray-400">No pairs added.</div> :
                    selectedPairs.map(p => (
                      <div key={`${p.color}-${p.size}`} className="flex items-center gap-3 mb-2">
                        <div>{p.color} / {p.size}</div>
                        <input type="number" min="5" step="5" value={quantities[`${p.color}-${p.size}`] || 5} onChange={(e)=>changeQty(p.color,p.size,e.target.value)} className="w-20 px-2 py-1 rounded bg-gray-700" />
                        <button onClick={()=>removePair(p.color,p.size)} className="text-red-400">Remove</button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-300">
                      {selectedColor && <div>Option: {selectedColor}</div>}
                      {selectedSize && <div>Option 2: {selectedSize}</div>}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={addToCart} className="px-4 py-2 bg-emerald-600 rounded">Add to Cart</button>
                  <button onClick={() => { setShowPaymentModal(true); }} className="px-4 py-2 bg-amber-500 rounded">Buy Now</button>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Perfect match & recommendations</h3>
                  {recommendations.length === 0 ? <div className="text-gray-400">No recommendations found.</div> :
                    <div className="flex gap-4 overflow-x-auto">
                      {recommendations.map((r, idx) => {
                        const name = r.name || r.productName || r;
                        const image = r.image || "/default-logo.png";
                        return (
                          <div key={idx} className="min-w-[160px] bg-gray-900 p-2 rounded cursor-pointer" onClick={() => handleRecommendationClick(r)}>
                            <img src={image} alt={name} className="w-full h-28 object-cover rounded mb-2" />
                            <div className="text-sm font-semibold">{name}</div>
                            <div className="text-xs text-gray-400">Perfect match</div>
                          </div>
                        );
                      })}
                    </div>
                  }
                  <div className="mt-3 text-xs text-gray-500">Recommendation debug: <pre className="text-xs">{JSON.stringify(recDebug, null, 2)}</pre></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-gray-800 rounded-xl p-6 w-full max-w-md z-70">
            <h3 className="text-xl font-bold mb-3">Simulated Payment</h3>
            <p className="text-gray-400 mb-4">You are about to pay for selected items (simulation).</p>
            <div className="flex gap-2">
              <button onClick={() => tryPaymentAndCreateOrder()} disabled={placingOrder} className="px-4 py-2 bg-emerald-600 rounded">{placingOrder ? "Processing..." : "Confirm Payment"}</button>
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
