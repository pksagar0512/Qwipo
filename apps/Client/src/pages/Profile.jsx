import { Link } from "react-router-dom";

const partnerCompanies = [
  {
    name: "Amul",
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
    category: "Electronics",
    products: [
      { name: "Laptop", price: 50000 },
      { name: "Mouse", price: 800 },
      { name: "Keyboard", price: 1200 },
      { name: "Monitor", price: 10000 },
    ],
  },
  {
    name: "Parle",
    category: "Snacks",
    products: [
      { name: "Parle-G Biscuits", price: 10 },
      { name: "Monaco", price: 20 },
      { name: "KrackJack", price: 30 },
      { name: "Hide & Seek", price: 50 },
    ],
  },
];

export default function Profile() {
  return (
    <div className="p-6 pt-20">
      {" "}
      {/* added pt-20 */}
      <h1 className="text-3xl font-bold mb-6">Our Partner Brands</h1>
      <ul className="space-y-3">
        {partnerCompanies.map((brand) => (
          <li key={brand.name}>
            <Link
              to={`/brand/${brand.name.toLowerCase()}`}
              state={{ brand }}
              className="block p-4 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold">{brand.name}</h2>
              <p className="text-gray-400">{brand.category}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
