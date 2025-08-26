import Navigation from "@/components/Navigation";
import SideMenu from "@/components/SideMenu";
import VillaGallery from "@/components/VillaGallery";
import Footer from "@/components/Footer";

const Gallery = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SideMenu />
      
      {/* Hero Section for Gallery Page */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Galleria Fotografica
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scopri la bellezza della nostra villa attraverso una collezione esclusiva di immagini
            </p>
          </div>
        </div>
      </section>

      <VillaGallery />
      <Footer />
    </div>
  );
};

export default Gallery;