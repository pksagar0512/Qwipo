const Hero = () => (
  <section className="text-center py-16 px-6">
    <h1 className="text-5xl font-bold mb-4 text-indigo-400 tracking-tight">
      Welcome to Qwipo
    </h1>
    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
      Your trusted B2B platform connecting retailers and manufacturers.
    </p>
    <a
      href="/products"
      className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 font-semibold"
    >
      Explore Products
    </a>
  </section>
);

export default Hero;