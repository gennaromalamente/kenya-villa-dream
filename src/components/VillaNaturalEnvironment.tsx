import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const naturalImages = [
  {
    src: "/lovable-uploads/c4f6c36a-c0ba-4fed-87fb-91ae47614dd2.png",
    title: "Safari in mongolfiera",
    description: "Vola sopra la savana e osserva gli elefanti dall'alto"
  },
  {
    src: "/lovable-uploads/7387bb3d-6250-4a38-8d16-b907b41c232e.png", 
    title: "Ghepardo nella savana",
    description: "Incontra i maestosi felini nel loro habitat naturale"
  }
];

const VillaNaturalEnvironment = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              L'ambiente naturale
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Le nostre Ville sorgono nel cuore di un ecosistema unico, dove la natura è protagonista. La savana africana si apre davanti a te con i suoi paesaggi sconfinati, le sfumature dorate al tramonto e l'incontro con una fauna straordinaria.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-6 hover-scale"
            >
              Scopri i dettagli
            </Button>
          </div>
          <div className="relative animate-fade-in">
            <Carousel className="w-full max-w-xs mx-auto lg:max-w-full">
              <CarouselContent>
                {naturalImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden hover-scale">
                      <CardContent className="p-0 relative">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-[400px] object-cover transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                          <p className="text-sm opacity-90">{image.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaNaturalEnvironment;