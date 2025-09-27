import { useLocation, useNavigate } from "react-router-dom";

export default function BrandProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const brand = location.state?.brand;

  if (!brand) {
    return (
      <div className="p-6">
        <p className="text-red-400">No brand selected.</p>
        <button
          onClick={() => navigate("/profile")}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-4">{brand.name} Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brand.products.map((product) => (
          <div
            key={product.name}
            className="p-4 bg-gray-800 rounded-lg shadow hover:scale-105 transition"
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-400">Price: ₹{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
