import Navigation from "@/components/Navigation";
import SideMenu from "@/components/SideMenu";
import VillaHero from "@/components/VillaHero";
import VillaFeatures from "@/components/VillaFeatures";
import VillaGallery from "@/components/VillaGallery";
import VillaInteriors from "@/components/VillaInteriors";
import VillaExteriors from "@/components/VillaExteriors";
import VillaServicesSections from "@/components/VillaServicesSections";
import VillaNaturalEnvironment from "@/components/VillaNaturalEnvironment";
import VillaLocation from "@/components/VillaLocation";
import VillaReviews from "@/components/VillaReviews";
import VillaCalendar from "@/components/VillaCalendar";
import VillaContact from "@/components/VillaContact";
import Footer from "@/components/Footer";
import PayPalTest from "@/components/PayPalTest";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SideMenu />
      <VillaHero />
      <VillaFeatures />
      <VillaGallery id="gallery" />
      <VillaInteriors />
      <VillaExteriors />
      <VillaServicesSections />
      <VillaNaturalEnvironment />
      <VillaLocation />
      <VillaReviews id="reviews" />
      <VillaCalendar id="calendar" />
      <VillaContact />
      
      {/* PayPal Test Component - Remove this after testing */}
      <section className="py-12 px-6 bg-muted/20">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">PayPal Integration Test</h2>
          <PayPalTest />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
