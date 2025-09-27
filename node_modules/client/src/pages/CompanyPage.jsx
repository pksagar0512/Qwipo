import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// ✅ Move your companies data here OR import from a shared file
const partnerCompanies = [
  {
    name: "Amul",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7b/Amul_logo.png",
    category: "Dairy",
    products: [
      { name: "Butter", price: 50 },
      { name: "Cheese", price: 120 },
      { name: "Milk", price: 30 },
      { name: "Paneer", price: 200 },
    ],
  },
  {
    name: "TechSupply",
    logo: "https://cdn-icons-png.flaticon.com/512/2698/2698305.png",
    category: "Electronics",
    products: [
      { name: "Keyboard", price: 800 },
      { name: "Mouse", price: 400 },
    ],
  },
  {
    name: "FreshMart",
    logo: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    category: "Groceries",
    products: [
      { name: "Rice", price: 60 },
      { name: "Wheat", price: 50 },
    ],
  },
];

const CompanyPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const company = partnerCompanies.find((c) => c.name === name);

  if (!company) {
    return (
      <div className="pt-24 p-6 text-white bg-gray-900 min-h-screen">
        <div>Company not found</div>
        <button
          onClick={() => navigate("/partners")}
          className="mt-4 bg-blue-600 px-4 py-2 rounded"
        >
          Back to Partners
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 p-6 text-white bg-gray-900 min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate("/partners")}
        className="mb-6 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back to Companies
      </button>

      {/* Company Header */}
      <div className="flex items-center mb-8">
        <img src={company.logo} alt={company.name} className="h-20 w-20 mr-6" />
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-gray-300 text-lg">{company.category}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {company.products.map((product, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-2xl font-bold text-green-400">₹{product.price}</p>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyPage;
