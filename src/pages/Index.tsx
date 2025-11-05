import Navigation from "@/components/Navigation";
import SideMenu from "@/components/SideMenu";
import VillaHero from "@/components/VillaHero";
import VillaFeatures from "@/components/VillaFeatures";
import VillaInteriors from "@/components/VillaInteriors";
import VillaExteriors from "@/components/VillaExteriors";
import VillaServicesSections from "@/components/VillaServicesSections";
import VillaNaturalEnvironment from "@/components/VillaNaturalEnvironment";
import VillaLocation from "@/components/VillaLocation";
import VillaReviews from "@/components/VillaReviews";
import VillaCalendar from "@/components/VillaCalendar";
import VillaContact from "@/components/VillaContact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SideMenu />
      <VillaHero />
      <VillaFeatures id="features" />
      <VillaInteriors id="interiors" />
      <VillaExteriors id="exteriors" />
      <VillaServicesSections id="services" />
      <VillaNaturalEnvironment id="environment" />
      <VillaLocation id="location" />
      <VillaReviews id="reviews" />
      <VillaCalendar id="calendar" />
      <VillaContact id="contact" />
      <Footer />
    </div>
  );
};

export default Index;
