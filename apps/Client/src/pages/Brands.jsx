import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Brands({ token, category }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) {
      setBrands([]);
      setLoading(false);
      return;
    }

    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/brands/category/${encodeURIComponent(category)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setBrands(data || []);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [category, token]);

  const goToBrand = (b) => {
    const logoSrc =
      b.brandLogo && b.brandLogo.startsWith("/uploads")
        ? `http://localhost:5000${b.brandLogo}`
        : b.brandLogo || b.sampleImage || "/default-logo.png";

    navigate(`/brand/${encodeURIComponent(b.brandName || b.name || "")}`, {
      state: { brand: { ...b, sampleImage: logoSrc } },
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3">Brands</h2>
        <div className="text-gray-400">Loading brands...</div>
      </div>
    );
  }

  if (!brands.length) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3">Brands</h2>
        <div className="text-gray-400">No brands found for this category.</div>
      </div>
    );
  }

  return (
    <div className="pt-28 px-6 pb-10 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Brands in your category
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {brands.map((b) => {
          const logoSrc =
            b.brandLogo && b.brandLogo.startsWith("/uploads")
              ? `http://localhost:5000${b.brandLogo}`
              : b.brandLogo || b.sampleImage || "/default-logo.png";

          return (
            <div
              key={b._id || b.brandName}
              onClick={() => goToBrand(b)}
              className="cursor-pointer bg-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all border border-gray-700"
            >
              <img
                src={logoSrc}
                alt={b.brandName}
                className="w-24 h-24 rounded-full object-cover border border-gray-600 mb-3"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/default-logo.png";
                }}
              />
              <h3 className="text-lg font-semibold text-white text-center">
                {b.brandName}
              </h3>
              <p className="text-sm text-gray-400 text-center">{b.category}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
