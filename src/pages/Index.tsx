import Navigation from "@/components/Navigation";
import VillaHero from "@/components/VillaHero";
import VillaFeatures from "@/components/VillaFeatures";
import VillaGallery from "@/components/VillaGallery";
import VillaLocation from "@/components/VillaLocation";
import VillaCalendar from "@/components/VillaCalendar";
import VillaServices from "@/components/VillaServices";
import VillaTestimonial from "@/components/VillaTestimonial";
import VillaReviews from "@/components/VillaReviews";
import VillaContact from "@/components/VillaContact";
import Footer from "@/components/Footer";
import FollowUpNotification from "@/components/FollowUpNotification";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <VillaHero />
      <VillaFeatures />
      <VillaGallery />
      <VillaLocation />
      <VillaCalendar />
      <VillaServices />
      <VillaTestimonial />
      <VillaReviews />
      <VillaContact />
      <Footer />
      <FollowUpNotification />
    </div>
  );
};

export default Index;
