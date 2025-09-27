import MainLayout from "../../layouts/MainLayout";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";

function Home() {
  const benefits = [
    { icon: "📊", title: "Enhance Market", desc: "Streamline operations on one platform—save time, boost efficiency, and grow." },
    { icon: "💳", title: "Payment Transparency & Security", desc: "All transactions are secure and transparent, giving you peace of mind." },
    { icon: "🚚", title: "Seamless Logistics Solutions", desc: "Optimize deliveries and track shipments effortlessly." },
    { icon: "⏰", title: "Around-the-Clock Support", desc: "Get assistance whenever you need it, 24/7." },
    { icon: "⚙️", title: "Efficient Business Management", desc: "Manage all your operations efficiently on a single platform." },
    { icon: "💰", title: "Flexible Financing Solutions", desc: "Access flexible credit to manage cash flow, maintain inventory, and meet demand." },
  ];

  const marketStats = [
    { icon: "🌟", title: "Boost Your Market Reach", desc: "Compete confidently in a digital-first world and grow your customer base efficiently." },
    { icon: "🚀", title: "Stay Ahead of Competitors", desc: "Innovate and digitize your offerings to remain visible 24/7 and capture new opportunities." },
    { icon: "🤝", title: "Connect With Thousands", desc: "Link your products with retailers, vendors, and partners across India seamlessly." },
    { icon: "📈", title: "Focus on Growth", desc: "Concentrate on sales while we handle logistics, operations, and market expansion." },
  ];

  const stats = [
    { number: "30K+", label: "Active Buyers & Sellers" },
    { number: "120+", label: "Trusted Brands" },
    { number: "15K+", label: "Products Listed" },
  ];

  return (
    <MainLayout>
      <Hero />

      {/* Features Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/10 backdrop-blur-md rounded-lg">
        <FeatureCard icon="💡" title="Smart Matching" desc="AI-powered recommendations tailored to your business needs." />
        <FeatureCard icon="✅" title="Verified Manufacturers" desc="Work only with trusted, vetted suppliers across India." />
        <FeatureCard icon="📈" title="Real-Time Insights" desc="Track product trends and demand with live analytics." />
        <FeatureCard icon="🚀" title="Fast Delivery" desc="Ensure timely delivery with our optimized logistics network." />
        <FeatureCard icon="🛡️" title="Secure Transactions" desc="Your payments are safe and encrypted end-to-end." />
        <FeatureCard icon="🌍" title="Global Reach" desc="Expand your business internationally with our partner network." />
      </section>

      {/* Benefits Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center hover:scale-105 transition transform">
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
            <p className="text-white/90">{benefit.desc}</p>
          </div>
        ))}
      </section>

      {/* Market Growth Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 mt-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Defend & Expand Your Market</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {marketStats.map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center hover:scale-105 transition transform">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
              <p className="text-white/90">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-8">
              <h3 className="text-4xl font-bold text-white mb-2">{stat.number}</h3>
              <p className="text-white/90">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Media Showcase Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 mt-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Media Showcase
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Media Item 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition">
            <img
              src="https://images.ctfassets.net/pdf29us7flmy/69LrnCK7nmkrzMtlqvNSGQ/90fb6628b02769642538f43f8587b416/GettyImages-1142966869-red.jpg?w=720&q=100&fm=jpg"
              alt="Interview"
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">CEO Interview</h3>
              <p className="text-white/80">Featured on Business Times</p>
            </div>
          </div>

          {/* Media Item 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR42wGoDZ68EpjVM7cNjOlKQxO8uk0jfAR89Q&s"
              alt="Award"
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Industry Award</h3>
              <p className="text-white/80">Recognized for Innovation 2024</p>
            </div>
          </div>

          {/* Media Item 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition">
            <img
              src="https://storage.googleapis.com/techsauce-prod/ugc/uploads/2025/5/1748592693_2-GTCTechConference.webp"
              alt="Conference"
              className="w-full h-56 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Global Conference</h3>
              <p className="text-white/80">Keynote at Tech Expo 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 text-center bg-blue-600/20 backdrop-blur-md rounded-lg max-w-screen-xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-white">Join Our Community</h2>
        <p className="mb-8 text-white/90">
          Be part of a growing network of businesses, manufacturers, and vendors. Share insights, collaborate, and expand your reach.
        </p>
        <a
          href="/contact"
          className="bg-white/90 text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-white transition"
        >
          Join Us
        </a>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 text-center bg-white/10 backdrop-blur-md rounded-lg max-w-screen-xl mx-auto px-6 mt-12">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Grow Your Business?</h2>
        <p className="mb-8 text-white/90">
          Join thousands of businesses leveraging AI-driven tools to boost their growth.
        </p>
        <a
          href="/register"
          className="bg-white/90 text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-white transition"
        >
          Get Started
        </a>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-screen-xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2">
              Phone: <a href="tel:+919564148609" className="hover:text-blue-400">+91 9564148609</a>
            </p>
            <p>
              Email: <a href="mailto:info@qwipo.com" className="hover:text-blue-400">info@qwipo.com</a>
            </p>
            <p>Corporate Office: <br />123 Business Street, City, India</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-blue-400">Home</a></li>
              <li><a href="/about" className="hover:text-blue-400">About Us</a></li>
              <li><a href="/services" className="hover:text-blue-400">Services</a></li>
              <li><a href="/blogs" className="hover:text-blue-400">Blogs</a></li>
              <li><a href="/career" className="hover:text-blue-400">Career</a></li>
              <li><a href="/partners" className="hover:text-blue-400">Partners</a></li>
              <li><a href="#contact" className="hover:text-blue-400">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="/terms-of-use" className="hover:text-blue-400">Terms of Use</a></li>
              <li><a href="/cookie-settings" className="hover:text-blue-400">Cookie Settings</a></li>
              <li><a href="/anti-spam" className="hover:text-blue-400">Anti-Spam</a></li>
              <li><a href="/user-agreement" className="hover:text-blue-400">User Agreement</a></li>
              <li><a href="/legal-notice" className="hover:text-blue-400">Legal Notice</a></li>
              <li><a href="/responsible-disclosure" className="hover:text-blue-400">Responsible Disclosure</a></li>
            </ul>
          </div>

          {/* Call to Action */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ready to Work?</h3>
            <p className="mb-4">Let's Talk and get your project started.</p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
            >
              Contact Us
            </a>
          </div>
        </div>

        
      </footer>
    </MainLayout>
  );
}

export default Home;
