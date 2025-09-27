import React from 'react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-gray-800 dark:bg-gray-700 text-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-indigo-400 font-bold mt-2">${product.price}</p>
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
