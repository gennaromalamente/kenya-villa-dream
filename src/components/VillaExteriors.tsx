import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const exteriorsImages = [
  {
    src: "/lovable-uploads/65d4f2f3-cb6a-4281-913b-1a5346bab970.png",
    title: "Architettura Coloniale",
    description: "Eleganza e autenticità si incontrano in questa villa gialla. Architettura coloniale circondata da palme e vegetazione tropicale, perfettamente integrata nella natura keniota."
  },
  {
    src: "/lovable-uploads/8cbd3845-b723-4cb5-b3e8-990971f286a2.png",
    title: "Villa nel Verde",
    description: "Un'oasi verde curata nei minimi dettagli. La villa vista dal giardino, completamente immersa nella natura lussureggiante del Kenya, dove pace e tranquillità regnano sovrane."
  },
  {
    src: "/lovable-uploads/7c90a53a-f01f-4c57-9f34-90dfa2c6ca46.png",
    title: "Area Relax Giardino",
    description: "Spazi perfetti per il relax all'aperto, letture sotto l'ombra e momenti di pace nella natura. Lettini comodi nel giardino tropicale per momenti di puro benessere."
  },
  {
    src: "/lovable-uploads/cb5b8d67-1b52-4ca7-9f4a-41fe98ab4c09.png",
    title: "Veranda Vista Giardino",
    description: "Veranda coperta con vista sul giardino tropicale. Vialetti in pietra naturale conducono attraverso la vegetazione lussureggiante, creando un ambiente di pace assoluta."
  },
  {
    src: "/lovable-uploads/05c3c364-3f5a-4f91-8c0f-3dd0081a2fe9.png",
    title: "Giardino Tropicale",
    description: "Immersa nella natura incontaminata del Kenya. Palme, alberi secolari e prati curati creano un paradiso verde dove rilassarsi e godersi la bellezza naturale."
  },
  {
    src: "/lovable-uploads/villa-pool-exterior.jpg",
    title: "Piscina Privata",
    description: "Villa con piscina privata esclusiva immersa nel verde. Architettura elegante con ampie verande e spazi esterni per il massimo relax."
  }
];

interface VillaExteriorsProps {
  id?: string;
}

const VillaExteriors = ({ id }: VillaExteriorsProps = {}) => {
  return (
    <section id={id} className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Esterni
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Avrai a disposizione un <strong>giardino</strong> privato di 5000 mq e una <strong>piscina privata ed esclusiva</strong>. L'area videosorvegliata con sicurezza privata h24 ti permetterà di non avere pensieri durante le tue giornate di relax fuori dalla Villa
              </p>
              <p>
                Uno spazio esterno che permetterà cene e pranzi esclusivi all'aperto. Potrai godere di aria pulita e naturale e di una vista rilassante che ti farà gustare ancora meglio i tuoi pasti preferiti
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
            <Carousel className="w-full">
              <CarouselContent>
                {exteriorsImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden hover-scale">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={image.src}
                            alt={image.title}
                            className="w-full h-[400px] object-cover transition-transform duration-500"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <h3 className="text-white font-semibold text-lg mb-1">{image.title}</h3>
                            <p className="text-white/90 text-sm line-clamp-2">{image.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaExteriors;