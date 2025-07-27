import Navigation from "@/components/Navigation";
import VillaHero from "@/components/VillaHero";
import VillaFeatures from "@/components/VillaFeatures";
import VillaGallery from "@/components/VillaGallery";
import VillaLocation from "@/components/VillaLocation";
import VillaCalendar from "@/components/VillaCalendar";
import VillaContact from "@/components/VillaContact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <VillaHero />
      <VillaFeatures />
      <VillaGallery />
      <VillaLocation />
      <VillaCalendar />
      <VillaContact />
      <Footer />
    </div>
  );
};

export default Index;
