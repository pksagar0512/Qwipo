import React, { useState, useEffect, useRef } from "react";

const About = () => {
  // Images for the slider
  const vendorImages = [
    "https://qwipo.com/assets/customer1.jpeg",
    "https://qwipo.com/assets/customer2.jpeg",
    "https://qwipo.com/assets/customer3.jpeg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = useRef();

  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % vendorImages.length);
    }, 3000); // change slide every 3 seconds

    return () => clearInterval(slideInterval.current);
  }, [vendorImages.length]);

  return (
    <div className="pt-24 px-6 bg-gray-900 text-white min-h-screen space-y-24">
      {/* Heading */}
      <section className="text-center space-y-6 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-400">
          Driving Growth in India’s E-Commerce Market
        </h1>

        <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
          India's e-commerce market is surging toward $100 billion by 2029. We
          spotted this potential early and launched Qwipo in 2018, with the
          mission of placing local SMBs ahead of the digital curve. Our platform
          equips traditional vendors including manufacturers with essential
          tools to stay competitive, focusing on the rapidly growing online
          grocery segment.
        </p>
      </section>

      {/* Vendors Challenges */}
      <section className="space-y-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-indigo-400">
          Overcoming Vendors’ Challenges
        </h2>

        <p className="text-gray-300 text-lg">
          Traditional vendors face digital disruption, financing gaps, and
          operational challenges. Qwipo provides the tools and support to
          overcome these roadblocks and grow.
        </p>

        {/* Challenge Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Intense competition with large e-commerce platform",
              color: "bg-green-100 text-green-600",
              icon: "📊",
            },
            {
              title: "Limited technology and tools for streamlining processes",
              color: "bg-orange-100 text-orange-600",
              icon: "💻",
            },
            {
              title:
                "Insufficient resources for sales and marketing management",
              color: "bg-blue-100 text-blue-600",
              icon: "📈",
            },
            {
              title:
                "Delivery and fulfillment complications and hurdles in logistics",
              color: "bg-yellow-100 text-yellow-600",
              icon: "🚚",
            },
            {
              title:
                "Cash flow management issues and difficulty in accessing affordable credit",
              color: "bg-red-100 text-red-600",
              icon: "💰",
            },
            {
              title:
                "Inefficiencies in business operations and limited dedicated resources",
              color: "bg-purple-100 text-purple-600",
              icon: "⚙️",
            },
            {
              title:
                "Trust deficit in quality, usability, warranties, and safety of products",
              color: "bg-green-100 text-green-700",
              icon: "🤝",
            },
            {
              title:
                "Transactional challenges such as price transparency and multi-geo sourcing",
              color: "bg-pink-100 text-pink-600",
              icon: "💳",
            },
          ].map((challenge, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center 
                         hover:shadow-2xl hover:-translate-y-3 transition-transform duration-300"
              style={{
                boxShadow: "0 0 15px 5px rgba(99, 102, 241, 0.4)",
              }}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full ${challenge.color} mb-4`}
              >
                <span className="text-2xl">{challenge.icon}</span>
              </div>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                {challenge.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Empowering Vendors */}
      <section className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl mx-auto">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-400">
            Qwipo: Empowering Vendors
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Qwipo bridges the gap for traditional vendors, manufacturers, and
            suppliers, providing digital tools, seamless logistics, and
            financing support to compete effectively in today’s digitized
            market.
          </p>
        </div>

        {/* Slider - shows one image at a time and auto changes */}
        <div className="flex-1 flex justify-center">
          <img
            src={vendorImages[currentIndex]}
            alt={`Empowering Vendor ${currentIndex + 1}`}
            className="w-full max-w-xl rounded-3xl shadow-xl object-cover transition-opacity duration-700"
            key={currentIndex}
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="space-y-6 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-indigo-400">
          Our Mission & Vision
        </h2>
        <img
          src="https://qwipo.com/assets/Qwipo-Banner-min.png"
          alt="Mission and Vision"
          className="w-full max-w-lg mx-auto rounded-3xl shadow-xl 
                     transition-transform duration-500 hover:scale-110"
        />
        <p className="text-gray-300 text-lg leading-relaxed">
          At Qwipo, our mission is to simplify the supply chain for small and
          medium businesses by connecting retailers, HORECA, and enterprises
          with trusted suppliers. We focus on groceries and FMCG, helping
          businesses save costs through direct procurement from prime suppliers,
          eliminating unnecessary middlemen.
        </p>
        <p className="text-gray-300 text-lg leading-relaxed">
          Our vision is to build a transparent, tech-driven ecosystem where
          logistics, financing, and procurement work seamlessly together,
          enabling every vendor to grow with confidence.
        </p>
      </section>

      {/* Team Section */}
      <section className="space-y-8 text-center max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-indigo-400">
          The Qwipo Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-gray-300">
          <div className="text-center bg-gray-800 p-6 rounded-3xl shadow-lg">
            <img
              src="https://qwipo.com/assets/siva2.jpeg"
              alt="Siva Morisetti"
              className="w-32 h-32 rounded-full mx-auto shadow-lg 
                         transition-transform duration-300 hover:-translate-y-2"
            />
            <h3 className="font-bold text-lg mt-4">Siva Morisetti</h3>
            <p>CEO and Co-founder</p>
          </div>
          <div className="text-center bg-gray-800 p-6 rounded-3xl shadow-lg">
            <img
              src="https://qwipo.com/assets/siva1.jpeg"
              alt="Siva Mamidi"
              className="w-32 h-32 rounded-full mx-auto shadow-lg 
                         transition-transform duration-300 hover:-translate-y-2"
            />
            <h3 className="font-bold text-lg mt-4">Siva Mamidi</h3>
            <p>CTO and Co-founder</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 max-w-4xl mx-auto bg-gray-800 py-12 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold text-indigo-400">
          Grow with Qwipo
        </h2>

        <p className="text-gray-300 text-lg">
          Empower your business with our seamless platform. Ready to take the
          next step? Contact us today.
        </p>
        <a
          href="/contact"
          className="inline-block bg-emerald-500 text-white px-8 py-3 rounded-full 
                     hover:bg-emerald-600 transition font-semibold"
        >
          Reach Out to Us
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 mt-16 rounded-t-3xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
            <p className="flex items-center gap-2">
              📞 <a href="tel:+919121222836">+91 9121222836</a>
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-indigo-400">Home</a></li>
              <li><a href="/about" className="hover:text-indigo-400">About Us</a></li>
              <li><a href="/services" className="hover:text-indigo-400">Services</a></li>
              <li><a href="/blogs" className="hover:text-indigo-400">Blogs</a></li>
              <li><a href="/career" className="hover:text-indigo-400">Career</a></li>
              <li><a href="/partners" className="hover:text-indigo-400">Partners</a></li>
              <li><a href="/contact" className="hover:text-indigo-400">Contact Us</a></li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Address</h3>
            <a 
              href="https://www.google.com/maps/place/Qwipo+(Xavica+Software+Solutions+Pvt+Ltd)/@17.443468,78.3910361,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb9bccdcd5863b:0xf0db7202a534cc54!8m2!3d17.443468!4d78.393611!16s%2Fg%2F11kynb4h4t?entry=ttu&g_ep=EgoyMDI1MDkyNC4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400 block"
            >
              Divyasree Trinity, Isprout Co-working Space,<br/>
              7th Floor, A-Wing, Plot No.5, at Hitech City Layout,<br/>
              Survey No 64(Part) Madhapur Village,<br/>
              Serilingampally Mandal, R R District,<br/>
              Hyderabad Telangana, 500081
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm">
          <p>© 2024 Qwipo. All rights reserved</p>
          <p className="mt-2">
            Cookie Settings, Anti-Spam, Privacy, User agreement, Legal Notice and Responsible Disclosure
          </p>
          {/* Social Icons */}
          <div className="flex justify-center gap-4 mt-4">
            <a 
              href="https://www.linkedin.com/company/qwipo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400"
            >
              LinkedIn
            </a>
            <a 
              href="https://www.facebook.com/qwipo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400"
            >
              Facebook
            </a>
            <a 
              href="https://www.instagram.com/qwipo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400"
            >
              Instagram
            </a>
            <a 
              href="https://twitter.com/qwipo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400"
            >
              Twitter
            </a>
            <a 
              href="https://www.pinterest.com/qwipo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400"
            >
              Pinterest
            </a>
            <a 
              href="https://apps.apple.com/app/qwipo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400"
            >
              App Store
            </a>
            <a 
              href="https://play.google.com/store/search?q=qwipo&c=apps&hl=en" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-400"
            >
              Google Play
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
