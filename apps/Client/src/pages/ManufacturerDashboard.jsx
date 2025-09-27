import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { addProduct, getMyProducts } from "../api/product";

const ManufacturerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const token = localStorage.getItem("token") || user?.token;

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const data = await getMyProducts(token);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productToAdd = {
        ...newProduct,
        brand: user.brandName,
      };
      await addProduct(productToAdd, token);
      setNewProduct({ name: "", price: "", image: "" });
      setShowForm(false);
      fetchProducts(); // refresh list
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6">Manufacturer Dashboard</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
              Save Product
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-400">No products added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-400">Brand: {product.brand}</p>
                <p className="text-gray-200 font-semibold">₹{product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
