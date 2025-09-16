import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const interiorsImages = [
  {
    src: "/lovable-uploads/383e09f1-942a-48d4-8193-b09a46867114.png",
    title: "Scale Coloniali",
    description: "Il cuore della villa dove ogni momento diventa speciale. Scale eleganti in stile coloniale con arredi raffinati che creano un'atmosfera di elegante relax e comfort."
  },
  {
    src: "/lovable-uploads/5339f94f-8a5f-4d7e-9d38-51256c13e648.png",
    title: "Soggiorno Luminoso",
    description: "Spazi amplissimi pensati per il comfort e la condivisione. Soggiorno con mobili in legno autentico e pavimento in Niru, dove tradizione africana e modernità si incontrano."
  },
  {
    src: "/lovable-uploads/135310cd-c73a-4941-a574-235caa369529.png",
    title: "Camera Matrimoniale",
    description: "Un rifugio di pace e comfort dove risvegliarsi ogni mattina è un piacere. Camera con pavimento in Galana e lavorazioni tipiche africane, design raffinato per notti di autentico relax."
  },
  {
    src: "/lovable-uploads/3dfd2cb6-5e4f-41b2-8e00-1ae7f72551b0.png",
    title: "Doppia Altezza",
    description: "Vista mozzafiato degli interni con soffitti alti e design moderno. Scale eleganti e spazi aperti che uniscono funzionalità e bellezza architettonica in perfetta armonia."
  },
  {
    src: "/lovable-uploads/8d51f039-877c-4179-aaef-3d41924043e0.png",
    title: "Living Principale",
    description: "Il cuore pulsante della villa con arredi tradizionali e tessuti colorati. Spazio luminoso perfetto per socializzare, con ventilatori a soffitto e design tipicamente africano."
  },
  {
    src: "/lovable-uploads/21648dd1-2992-453e-a5cf-5981d0f35391.png",
    title: "Area Relax Superiore",
    description: "Spazio intimo al piano superiore per momenti di relax. Arredi comodi con tessuti dai colori caldi e vista panoramica, perfetto per letture e conversazioni."
  },
  {
    src: "/lovable-uploads/0eb7cee0-00f3-43e6-bf34-0ff410bcfdd7.png",
    title: "Soggiorno Piano Alto",
    description: "Area sociale al piano superiore con vista sul giardino. Mobili in legno massello e tessuti africani creano un ambiente accogliente e raffinato."
  },
  {
    src: "/lovable-uploads/4e6f663f-cf98-4f7f-b455-5c217e8c83e1.png",
    title: "Bagno Principale",
    description: "Bagno elegante con doppio lavabo e specchi con cornice in legno. Design pulito e funzionale con materiali di qualità e attenzione ai dettagli."
  }
];

const VillaInteriors = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative animate-fade-in">
            <Carousel className="w-full">
              <CarouselContent>
                {interiorsImages.map((image, index) => (
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
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Interni
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                La Villa ha una superficie interna di oltre mq, suddivisa in sei grandi ambienti di <strong>lusso</strong>: tre <strong>suite</strong>, due <strong>camere</strong> e una <strong>dépendance</strong> con vasca <strong>idromassaggio</strong> e <strong>aria condizionata</strong>.
              </p>
              <p>
                Può ospitare comodamente dieci o dodici persone di tutte le età e con le più varie esigenze, permettendo a ognuna la sua più completa privacy. È disposta su due piani, ha sei camere da letto con bagno indipendente, tre cucine attrezzate, tre salotti con <strong>camino</strong>.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-6 hover-scale"
            >
              Scopri i dettagli
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaInteriors;