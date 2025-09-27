const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-gray-800 rounded-xl p-8 text-center shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

export default FeatureCard;