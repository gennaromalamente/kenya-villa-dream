import { Card, CardContent } from "@/components/ui/card";
import { Bath, Bed, MapPin, Car, Utensils, Wifi } from "lucide-react";

const features = [
  {
    icon: <Bed className="w-8 h-8" />,
    title: "3 Camere Patronali",
    description: "Spaziose camere con bagno privato e comfort moderni"
  },
  {
    icon: <Bath className="w-8 h-8" />,
    title: "2 Bagni Privati",
    description: "Eleganti bagni in stile coloniale con finiture di pregio"
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "10 min dalla Spiaggia",
    description: "A soli 10 minuti a piedi dalle acque cristalline e sabbie bianche del Kenya"
  },
  {
    icon: <Car className="w-8 h-8" />,
    title: "5 min con Tuk Tuk",
    description: "Ristoranti, locali e negozi facilmente raggiungibili"
  },
  {
    icon: <Utensils className="w-8 h-8" />,
    title: "Area Cucina",
    description: "Una cucina attrezzata per preparare, o far preparare da uno chef privato, i tuoi piatti preferiti"
  },
  {
    icon: <Wifi className="w-8 h-8" />,
    title: "Comfort Moderni",
    description: "WiFi gratuito, sicurezza h24 e tutti i servizi necessari"
  }
];

interface VillaFeaturesProps {
  id?: string;
}

const VillaFeatures = ({ id }: VillaFeaturesProps = {}) => {
  return (
    <section id={id} className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Un Rifugio</span> di Eleganza
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            240 metri quadri di spazi luminosi e confortevoli, 
            progettati per offrire un'esperienza autentica e rilassante nel cuore del Kenya
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover-lift border-0 shadow-lg overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 text-primary group-hover:text-accent transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VillaFeatures;