import { useState, useEffect } from "react";

const Blogs = () => {
  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem("blogs");
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", description: "", photo: "" });
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(blogs));
  }, [blogs]);

  const handleAddBlog = () => {
    if (newBlog.title.trim() || newBlog.description.trim() || newBlog.photo.trim()) {
      const updated = [{ ...newBlog }, ...blogs];
      setBlogs(updated);
      setNewBlog({ title: "", description: "", photo: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="text-center mt-16">
      <h1 className="text-3xl font-bold">Blogs Page</h1>
      <p className="text-gray-300">Latest insights and updates from Qwipo.</p>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {/* Create Post Card */}
        <div
          className="flex flex-col items-center justify-center bg-white/10 p-6 rounded-lg cursor-pointer hover:bg-white/20 transition"
          onClick={() => setShowForm(true)}
        >
          <span className="text-5xl font-bold">+</span>
          <p className="mt-2 text-lg">Create Post</p>
        </div>

        {/* Blog Cards */}
        {blogs.map((blog, index) => (
          <div key={index} className="bg-white/10 p-4 rounded-lg flex flex-col">
            {blog.photo && (
              <img
                src={blog.photo}
                alt={blog.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="mt-2 line-clamp-2">{blog.description}</p>

            {blog.description.length > 80 && (
              <button
                onClick={() => setSelectedBlog(blog)}
                className="mt-2 text-blue-400 hover:underline self-start"
              >
                Read More
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 p-6 rounded-lg w-96 text-white">
            <h2 className="text-2xl mb-4 font-bold">Create New Blog</h2>
            <input
              type="text"
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={newBlog.photo}
              onChange={(e) => setNewBlog({ ...newBlog, photo: e.target.value })}
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
            />
            <textarea
              placeholder="Description"
              value={newBlog.description}
              onChange={(e) =>
                setNewBlog({ ...newBlog, description: e.target.value })
              }
              className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
              rows="4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBlog}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto text-white">
            {selectedBlog.photo && (
              <img
                src={selectedBlog.photo}
                alt={selectedBlog.title}
                className="w-full h-60 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-3">{selectedBlog.title}</h2>
            <p>{selectedBlog.description}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
