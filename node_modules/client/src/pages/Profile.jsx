import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  const companies = [
    { name: "FreshMart", category: "Groceries" },
    { name: "TechSupply", category: "Electronics" },
    { name: "MedicoPlus", category: "Pharmaceuticals" },
  ];

  return (
    <div className="pt-24 p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
      <p className="mb-6">Here are companies tied with Qwipo. You can place orders directly.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-semibold text-purple-400">{company.name}</h3>
            <p className="text-sm text-gray-300">Category: {company.category}</p>
            <button className="mt-4 bg-emerald-500 px-4 py-2 rounded text-white hover:bg-emerald-600">
              Place Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;