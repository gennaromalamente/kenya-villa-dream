import VillaHero from "@/components/VillaHero";
import VillaFeatures from "@/components/VillaFeatures";
import VillaLocation from "@/components/VillaLocation";
import VillaTestimonial from "@/components/VillaTestimonial";
import VillaContact from "@/components/VillaContact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <VillaHero />
      <VillaFeatures />
      <VillaLocation />
      <VillaTestimonial />
      <VillaContact />
    </div>
  );
};

export default Index;
