import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProduct"
import HowItWorks from "../components/HowItWorks";
import CategorySection from "../components/CategorySection";
import PromoBanner from "../components/PromoBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f6ebe1] via-[#e8d5c4] to-[#cfb8a2] text-zinc-900 dark:from-[#1a1614] dark:via-[#241e1a] dark:to-[#120f0d] dark:text-zinc-100">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <HowItWorks />
      <PromoBanner />
    </main>
  );
}