import React, { useState } from 'react';

export default function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <div className="bg-gray-800 dark:bg-gray-700 text-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-indigo-400 font-bold mt-2">₹{product.price}</p>

        {/* Color Swatches */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-1">Select Color:</p>
          <div className="flex flex-wrap gap-2">
            {(product.colors || []).map((color) => (
              <div
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded cursor-pointer border-2 ${
                  selectedColor === color ? "border-emerald-500" : "border-gray-500"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Size Options */}
        <div className="mt-4">
          <p className="text-sm font-semibold mb-1">Select Size:</p>
          <div className="flex flex-wrap gap-2">
            {(product.sizes || []).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 rounded border text-sm ${
                  selectedSize === size
                    ? "bg-emerald-600 border-emerald-400"
                    : "bg-gray-700 border-gray-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          Add to Cart
        </button>

        {/* Selected Info */}
        <div className="mt-2 text-sm">
          <p>Color: <span className="font-bold">{selectedColor || "None"}</span></p>
          <p>Size: <span className="font-bold">{selectedSize || "None"}</span></p>
        </div>
      </div>
    </div>
  );
}