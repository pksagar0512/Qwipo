import MainLayout from "../../layouts/MainLayout";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";

function Home() {
  return (
    <MainLayout>
      <Hero />

      <section className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon="💡"
          title="Smart Matching"
          desc="AI-powered recommendations tailored to your business needs."
        />
        <FeatureCard
          icon="✅"
          title="Verified Manufacturers"
          desc="Work only with trusted, vetted suppliers across India."
        />
        <FeatureCard
          icon="📈"
          title="Real-Time Insights"
          desc="Track product trends and demand with live analytics."
        />
      </section>
    </MainLayout>
  );
}

export default Home;