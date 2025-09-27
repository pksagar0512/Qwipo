import React, { useEffect, useState } from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const category = user?.retailerType;
  const userName = user?.name;
  const retailerId = user?._id;

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [paymentMode, setPaymentMode] = useState("creditCard");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      fetch(`http://localhost:5000/api/brands?category=${category}`)
        .then((res) => res.json())
        .then((data) => setBrands(data))
        .catch(() => setError("Failed to load brands"));
    }
  }, [category]);

  const handleBrandClick = async (brandName) => {
    setSelectedBrand(brandName);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/products?brand=${brandName}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setQuantities({});
    } catch {
      setError("Failed to load products");
    }
  };

  const handleQuantityChange = (productId, qty) => {
    setQuantities({ ...quantities, [productId]: qty });
  };

  const handlePlaceOrder = async () => {
    const orderItems = products
      .filter((p) => quantities[p._id] > 0)
      .map((p) => ({
        productId: p._id,
        quantity: quantities[p._id],
        price: p.price,
      }));

    if (orderItems.length === 0) {
      setError("Please select at least one product");
      return;
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const advance = Math.round(total * 0.5);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retailerId,
          brandName: selectedBrand,
          products: orderItems,
          totalAmount: total,
          advancePaid: advance,
          paymentMode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Order placed! Pay ₹${advance} via ${paymentMode}.`);
        setProducts([]);
        setSelectedBrand(null);
        setQuantities({});
      } else {
        setError(data.message || "Order failed");
      }
    } catch {
      setError("Server error while placing order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-24 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
        <p className="text-sm text-gray-400">Category: {category}</p>
      </div>

      {!selectedBrand ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Available Brands</h2>
          {brands.length === 0 ? (
            <p className="text-red-400">No brands found for category: {category}</p>
          ) : (
            <div className="space-y-2">
              {brands.map((brand) => (
                <p key={brand._id}>
                  <button
                    onClick={() => handleBrandClick(brand.brandName)}
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    {brand.brandName}
                  </button>
                </p>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Products from {selectedBrand}</h2>
          {products.length === 0 ? (
            <p className="text-red-400">No products found for brand: {selectedBrand}</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-800 p-4 rounded flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-400">₹{product.price}</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    value={quantities[product._id] || ""}
                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                    className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm mb-1">Select Payment Method:</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded"
            >
              <option value="creditCard">Credit Card</option>
              <option value="netBanking">Net Banking</option>
            </select>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handlePlaceOrder}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded"
            >
              Place Order (Pay 50%)
            </button>
            <button
              onClick={() => setSelectedBrand(null)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Back to Brands
            </button>
          </div>
        </>
      )}

      {message && <p className="text-green-400 mt-4">{message}</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );
}