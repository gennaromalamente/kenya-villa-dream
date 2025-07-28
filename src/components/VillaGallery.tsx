import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const galleryImages = [
  // Interni
  {
    src: "/lovable-uploads/383e09f1-942a-48d4-8193-b09a46867114.png",
    title: "Scale Coloniali",
    description: "Il cuore della villa dove ogni momento diventa speciale. Scale eleganti in stile coloniale con arredi raffinati che creano un'atmosfera di elegante relax e comfort.",
    category: "interni"
  },
  {
    src: "/lovable-uploads/5339f94f-8a5f-4d7e-9d38-51256c13e648.png",
    title: "Soggiorno Luminoso",
    description: "Spazi amplissimi pensati per il comfort e la condivisione. Soggiorno con mobili in legno autentico e pavimento in Niru, dove tradizione africana e modernità si incontrano.",
    category: "interni"
  },
  {
    src: "/lovable-uploads/135310cd-c73a-4941-a574-235caa369529.png",
    title: "Camera Matrimoniale",
    description: "Un rifugio di pace e comfort dove risvegliarsi ogni mattina è un piacere. Camera con pavimento in Galana e lavorazioni tipiche africane, design raffinato per notti di autentico relax.",
    category: "interni"
  },
  // Esterni
  {
    src: "/lovable-uploads/65d4f2f3-cb6a-4281-913b-1a5346bab970.png",
    title: "Architettura Coloniale",
    description: "Eleganza e autenticità si incontrano in questa villa gialla. Architettura coloniale circondata da palme e vegetazione tropicale, perfettamente integrata nella natura keniota.",
    category: "esterni"
  },
  {
    src: "/lovable-uploads/8cbd3845-b723-4cb5-b3e8-990971f286a2.png",
    title: "Villa nel Verde",
    description: "Un'oasi verde curata nei minimi dettagli. La villa vista dal giardino, completamente immersa nella natura lussureggiante del Kenya, dove pace e tranquillità regnano sovrane.",
    category: "esterni"
  },
  {
    src: "/lovable-uploads/7c90a53a-f01f-4c57-9f34-90dfa2c6ca46.png",
    title: "Area Relax Giardino",
    description: "Spazi perfetti per il relax all'aperto, letture sotto l'ombra e momenti di pace nella natura. Lettini comodi nel giardino tropicale per momenti di puro benessere.",
    category: "esterni"
  }
];

const VillaGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredImages = activeCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-secondary/20 to-accent/10">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Galleria Fotografica</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ogni angolo della villa racconta una storia di eleganza e comfort autentico
          </p>
          
          {/* Filtri categorie */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => setActiveCategory("all")}
              className="rounded-full"
            >
              Tutte le Foto
            </Button>
            <Button
              variant={activeCategory === "interni" ? "default" : "outline"}
              onClick={() => setActiveCategory("interni")}
              className="rounded-full"
            >
              Interni
            </Button>
            <Button
              variant={activeCategory === "esterni" ? "default" : "outline"}
              onClick={() => setActiveCategory("esterni")}
              className="rounded-full"
            >
              Esterni
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredImages.map((image, index) => (
            <Dialog key={index} open={isDialogOpen && selectedImage === index} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card 
                  className="cursor-pointer hover-lift overflow-hidden group"
                  onClick={() => {
                    setSelectedImage(index);
                    setIsDialogOpen(true);
                  }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={image.src} 
                        alt={image.title}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                          <p className="text-sm text-white/90 line-clamp-2">{image.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-5xl w-full p-0 bg-black/95">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  
                   <div className="relative">
                     <img 
                       src={filteredImages[selectedImage].src} 
                       alt={filteredImages[selectedImage].title}
                       className="w-full h-[70vh] object-contain"
                     />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </div>
                  
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                     <h3 className="text-2xl font-bold text-white mb-2">
                       {filteredImages[selectedImage].title}
                     </h3>
                     <p className="text-white/90 text-lg leading-relaxed">
                       {filteredImages[selectedImage].description}
                     </p>
                   </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VillaGallery;