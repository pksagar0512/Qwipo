const About = () => {
  return (
    <div className="pt-24 px-6 bg-gray-900 text-white min-h-screen space-y-16">
      {/* Heading */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-indigo-400">
          Driving Growth in India’s E-Commerce Market
        </h1>
        <p className="text-gray-300 text-lg max-w-4xl mx-auto">
          India's e-commerce market is surging toward $100 billion by 2029. We spotted this potential early and launched Qwipo in 2018, with the mission of placing local SMBs ahead of the digital curve. Our platform equips traditional vendors including manufacturers with essential tools to stay competitive, focusing on the rapidly growing online grocery segment.
        </p>
      </section>

      {/* Vendors Challenges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-400">
          Overcoming Vendors’ Challenges
        </h2>
        <p className="text-gray-300">
          Traditional vendors face digital disruption, financing gaps, and operational challenges. Qwipo provides the tools and support to overcome these roadblocks and grow.
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Intense competition with large e-commerce platforms</li>
          <li>Limited technology and tools for streamlining processes</li>
          <li>Insufficient resources for sales and marketing management</li>
          <li>Delivery and fulfillment complications and hurdles in logistics</li>
          <li>Cash flow management issues and difficulty in accessing affordable credit</li>
          <li>Inefficiencies in business operations and limited dedicated resources</li>
          <li>Trust deficit in quality, usability, warranties, and safety of products</li>
          <li>Transactional challenges such as price transparency and multi-geo sourcing</li>
        </ul>
      </section>

      {/* Empowering Vendors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-400">
          Qwipo: Empowering Vendors
        </h2>
        <p className="text-gray-300">
          Qwipo bridges the gap for traditional vendors, manufacturers, and suppliers, providing digital tools, seamless logistics, and financing support to compete effectively in today’s digitized market.
        </p>
      </section>

      {/* Team Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-400">
          The Qwipo Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
          <div>
            <h3 className="font-bold text-lg">Siva Morisetti</h3>
            <p>CEO and Co-founder</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Siva Mamidi</h3>
            <p>CTO and Co-founder</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-indigo-400">
          Grow with Qwipo
        </h2>
        <p className="text-gray-300">
          Empower your business with our seamless platform. Ready to take the next step? Contact us today.
        </p>
        <a
          href="/contact"
          className="inline-block bg-emerald-500 text-white px-6 py-3 rounded hover:bg-emerald-600 transition font-semibold"
        >
          Reach Out to Us
        </a>
      </section>
    </div>
  );
};

export default About;