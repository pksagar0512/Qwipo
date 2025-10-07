import React, { useState } from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;

  const productsData = [
    {
      _id: "1",
      name: "Sherwani",
      price: 2999,
      image: "https://tiimg.tistatic.com/fp/1/876/sherwani-523.jpg",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Gold", "Cream", "Maroon", "Black", "White", "Red", "Blue"],
      description: "Elegant Sherwani for festive occasions.",
    },
    {
      _id: "2",
      name: "Kurta",
      price: 1299,
      image:
        "https://5.imimg.com/data5/SELLER/Default/2024/1/375219629/OG/TZ/HM/144053780/lakhnavi-kurta.jpeg",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "White", "Cream", "Black", "Green", "Yellow", "Red"],
      description: "Comfortable Kurta for casual wear.",
    },
    {
      _id: "3",
      name: "Jooti",
      price: 499,
      image:
        "https://media.istockphoto.com/id/1126362690/photo/groom-footwear.jpg?s=612x612&w=0&k=20&c=fTj-RyWyGOjpLcFDKXgezI6ElOrKASMiVFwDF17b-Oo=",
      sizes: ["7", "8", "9", "10"],
      colors: ["Brown", "Cream", "Tan", "Black", "White", "Golden", "Maroon"],
      description: "Traditional Jooti matching your outfits.",
    },
    {
      _id: "4",
      name: "Dupatta",
      price: 299,
      image:
        "https://i.etsystatic.com/22117864/r/il/ee3c6d/4735670455/il_fullxfull.4735670455_1fv1.jpg",
      sizes: ["One Size"],
      colors: ["Red", "Blue", "Yellow", "Green", "Pink", "Orange", "Purple"],
      description: "Colorful Dupatta to complete your look.",
    },
    {
      _id: "5",
      name: "Sherwani Set",
      price: 3999,
      image:
        "https://i.etsystatic.com/37668241/r/il/14d547/6192373009/il_fullxfull.6192373009_epea.jpg",
      sizes: ["M", "L", "XL"],
      colors: ["Cream", "Gold", "White", "Red", "Blue", "Black", "Maroon"],
      description: "Complete Sherwani set with accessories.",
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedPairs, setSelectedPairs] = useState({});
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showBill, setShowBill] = useState(false);

  // ------------------ BILL/GST -------------------
  const gstRate = 0.07; // 7% GST
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gstAmount = total * gstRate;
  const totalWithGst = total + gstAmount;
  const generateBillNumber = () => Math.floor(100000 + Math.random() * 900000);
  const billNumber = generateBillNumber();

  const handleViewProduct = (product) => setSelectedProduct(product);

  const handleColorToggle = (productId, color) => {
    setSelectedColors((prev) => {
      const current = prev[productId] || [];
      const updated = current.includes(color)
        ? current.filter((c) => c !== color)
        : [...current, color];
      return { ...prev, [productId]: updated };
    });
  };

  const handleSizeToggle = (productId, size) => {
    setSelectedSizes((prev) => {
      const current = prev[productId] || [];
      const updated = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];
      return { ...prev, [productId]: updated };
    });
  };

  const handleQuantityChange = (productId, color, size, qty) => {
    if (qty < 5) qty = 5;
    setQuantities((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [`${color}-${size}`]: qty,
      },
    }));
  };

  const handleAddPair = (productId, color, size) => {
    if (!color || !size)
      return alert("Please select both a color and a size before adding!");
    setSelectedPairs((prev) => {
      const current = prev[productId] || [];
      const exists = current.find((p) => p.color === color && p.size === size);
      if (exists) return prev;
      return { ...prev, [productId]: [...current, { color, size }] };
    });
    setQuantities((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [`${color}-${size}`]: prev[productId]?.[`${color}-${size}`] || 5,
      },
    }));
  };

  const handleAddToCart = (product) => {
    const pairs = selectedPairs[product._id] || [];
    if (!pairs.length) return alert("Select at least one color & size pair");
    const newItems = pairs.map(({ color, size }) => ({
      ...product,
      selectedColor: color,
      selectedSize: size,
      quantity: quantities[product._id]?.[`${color}-${size}`] || 5,
    }));
    setCart([...cart, ...newItems]);
    setSelectedProduct(null);
    setSelectedColors((prev) => ({ ...prev, [product._id]: [] }));
    setSelectedSizes((prev) => ({ ...prev, [product._id]: [] }));
    setSelectedPairs((prev) => ({ ...prev, [product._id]: [] }));
    setQuantities((prev) => ({ ...prev, [product._id]: {} }));
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handlePlaceOrder = () => {
    if (!cart.length) return alert("Cart is empty!");
    setShowPayment(true);
  };

  const handleConfirmPayment = () => {
    setShowBill(true);
  };

  const suggestions = selectedProduct
    ? productsData.filter((p) => p._id !== selectedProduct._id)
    : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">

      {/* ---------- SHOW MAIN SECTIONS ONLY WHEN NOT PAYMENT ---------- */}
      {!showPayment && !showBill && (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome, {userName}!</h1>

          {/* PRODUCT GRID */}
          {!selectedProduct && (
            <div className="grid grid-cols-3 gap-4">
              {productsData.map((p) => (
                <div
                  key={p._id}
                  className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
                  onClick={() => handleViewProduct(p)}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h3 className="font-bold">{p.name}</h3>
                  <p>₹{p.price}</p>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCT DETAILS */}
          {selectedProduct && (
            <div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="underline mb-4 text-blue-400"
              >
                ← Back to products
              </button>
              <div className="flex flex-col md:flex-row gap-6 bg-gray-800 p-4 rounded">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full md:w-1/2 rounded"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="my-2">{selectedProduct.description}</p>
                  <p className="font-semibold">₹{selectedProduct.price}</p>

                  {/* COLORS */}
                  <div className="mt-4">
                    <p>Colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            handleColorToggle(selectedProduct._id, color)
                          }
                          className={`px-3 py-1 rounded border ${selectedColors[selectedProduct._id]?.includes(color)
                              ? "bg-emerald-600 border-emerald-400"
                              : "bg-gray-700 border-gray-500"
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SIZES */}
                  <div className="mt-4">
                    <p>Sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            handleSizeToggle(selectedProduct._id, size)
                          }
                          className={`px-3 py-1 rounded border ${selectedSizes[selectedProduct._id]?.includes(size)
                              ? "bg-emerald-600 border-emerald-400"
                              : "bg-gray-700 border-gray-500"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ADD PAIR BUTTON */}
                  <div className="mt-4 flex gap-2">
                    {(selectedColors[selectedProduct._id] || []).map((color) =>
                      (selectedSizes[selectedProduct._id] || []).map((size) => (
                        <button
                          key={`${color}-${size}`}
                          onClick={() =>
                            handleAddPair(selectedProduct._id, color, size)
                          }
                          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Add {color} / {size}
                        </button>
                      ))
                    )}
                  </div>

                  {/* QUANTITIES */}
                  <div className="mt-4">
                    {(selectedPairs[selectedProduct._id] || []).map(
                      ({ color, size }) => (
                        <div
                          key={`${color}-${size}`}
                          className="flex items-center gap-2 mb-1"
                        >
                          <span className="text-sm">{color} / {size}</span>
                          <input
                            type="number"
                            min="5"
                            step="5"
                            value={
                              quantities[selectedProduct._id]?.[`${color}-${size}`] || 5
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                selectedProduct._id,
                                color,
                                size,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(selectedProduct)}
                      className="px-4 py-2 bg-emerald-500 rounded hover:bg-emerald-600"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">You may also like:</h3>
                      <div className="flex gap-4 overflow-x-auto">
                        {suggestions.map((s) => (
                          <div
                            key={s._id}
                            className="flex-shrink-0 w-32 bg-gray-700 p-2 rounded cursor-pointer"
                            onClick={() => handleViewProduct(s)}
                          >
                            <img
                              src={s.image}
                              alt={s.name}
                              className="w-full h-20 object-cover rounded"
                            />
                            <p className="text-xs mt-1">{s.name}</p>
                            <p className="text-xs">₹{s.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CART */}
          {cart.length > 0 && (
            <div className="mt-8 bg-gray-800 p-4 rounded">
              <h3 className="font-bold mb-2">Cart ({cart.length})</h3>
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <span>
                    {item.name} | {item.selectedColor} | {item.selectedSize} | Qty:{" "}
                    {item.quantity} | ₹{item.price}
                  </span>
                  <button
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => handleRemoveFromCart(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-2">
                <p className="font-semibold">Subtotal: ₹{total}</p>
                <p className="font-semibold">GST (7%): ₹{gstAmount.toFixed(2)}</p>
                <p className="font-bold">Total: ₹{totalWithGst.toFixed(2)}</p>
                <button
                  className="mt-2 px-4 py-2 bg-emerald-500 rounded hover:bg-emerald-600"
                  onClick={handlePlaceOrder}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---------- PAYMENT PAGE ---------- */}
      {showPayment && !showBill && (
        <div className="bg-gray-800 p-6 rounded max-w-md mx-auto mt-10 text-center">
          <h2 className="text-xl font-bold mb-4">Brand: PK</h2>

          <div className="mt-4 text-left">
            <h3 className="font-semibold mb-1">Order Summary:</h3>
            {cart.map((item, i) => (
              <p key={i}>
                {item.name} | {item.selectedColor} | {item.selectedSize} | Qty: {item.quantity} | ₹{item.price}
              </p>
            ))}
            <p className="font-bold mt-2">Subtotal: ₹{total}</p>
            <p className="font-bold">GST (7%): ₹{gstAmount.toFixed(2)}</p>
            <p className="font-bold">Total with GST: ₹{totalWithGst.toFixed(2)}</p>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <button
              className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700"
              onClick={handleConfirmPayment}
            >
              Confirm Payment
            </button>
            <button
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              onClick={() => setShowPayment(false)}
            >
              Back
            </button>
          </div>
        </div>
      )}


      {/* BILL / INVOICE */}
      {showBill && (
        <div className="bg-gray-800 p-6 rounded max-w-md mx-auto mt-10">
          <h2 className="text-xl font-bold text-center mb-4">Invoice</h2>
          <p>Invoice No: #{billNumber}</p>
          <p>Buyer: {userName}</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
          <hr className="my-2 border-gray-600" />
          {cart.map((item, i) => (
            <p key={i}>
              {item.name} | {item.selectedColor} | {item.selectedSize} | Qty: {item.quantity} × ₹{item.price}
            </p>
          ))}
          <hr className="my-2 border-gray-600" />
          <p className="font-bold">Subtotal: ₹{total}</p>
          <p className="font-bold">GST (7%): ₹{gstAmount.toFixed(2)}</p>
          <p className="font-bold">Total: ₹{totalWithGst.toFixed(2)}</p>
          <p className="text-sm mt-2">
            Paid to: Royal Attire Manufacturers (HDFC Bank)
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700"
              onClick={() => window.print()}
            >
              Download Bill
            </button>
            <button
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              onClick={() => {
                setShowBill(false);
                setCart([]);
                setShowPayment(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
