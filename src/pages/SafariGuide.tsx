import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Sunrise, 
  Ship, 
  Moon, 
  Binoculars, 
  Mountain 
} from "lucide-react";

const safariServices = [
  {
    icon: <Camera className="w-12 h-12" />,
    title: "Safari privato",
    description: "Esplora la savana con la tua guida personale per avvistare i Big Five in totale privacy e comfort.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop"
  },
  {
    icon: <Sunrise className="w-12 h-12" />,
    title: "Safari in mongolfiera",
    description: "Vola sopra la savana all'alba e ammira il paesaggio africano da una prospettiva unica e mozzafiato.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
  },
  {
    icon: <Ship className="w-12 h-12" />,
    title: "Safari in barca",
    description: "Naviga lungo i fiumi del Kenya per osservare ippopotami, coccodrilli e una ricca avifauna acquatica.",
    image: "https://images.unsplash.com/photo-1605538883669-825200433431?w=600&h=400&fit=crop"
  },
  {
    icon: <Moon className="w-12 h-12" />,
    title: "Safari notturno",
    description: "Scopri la vita notturna della savana con guide esperte per incontrare i predatori e la fauna notturna.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop"
  },
  {
    icon: <Binoculars className="w-12 h-12" />,
    title: "Birdwatching",
    description: "Kenya ospita oltre 1.000 specie di uccelli. Scopri i magnifici aironi, fenicotteri e rapaci africani.",
    image: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=600&h=400&fit=crop"
  },
  {
    icon: <Mountain className="w-12 h-12" />,
    title: "Escursioni",
    description: "Camminate guidate nella natura per scoprire la flora locale, villaggi tradizionali e panorami spettacolari.",
    image: "https://images.unsplash.com/photo-1515942661500-464c22d1b6e4?w=600&h=400&fit=crop"
  }
];

const SafariGuide = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-background to-accent/5">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Safari</span> e Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vivi l'Africa autentica con le nostre esperienze safari personalizzate. 
            Ogni tour è pensato per offrirti un'avventura indimenticabile nella natura selvaggia del Kenya.
          </p>
        </div>
      </section>

      {/* Safari Services Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {safariServices.map((service, index) => (
              <div 
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="flex-1">
                  <Card className="overflow-hidden hover-scale">
                    <CardContent className="p-0">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-[300px] object-cover transition-transform duration-500"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-primary/20 text-primary">
                      {service.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {service.title}
                    </h2>
                  </div>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  <Button className="hover-scale">
                    Prenota ora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-accent/10">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Personalizza la Tua Avventura Safari
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Ogni safari può essere combinato e personalizzato secondo le tue preferenze. 
              Contattaci per creare il tuo itinerario perfetto in Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="hover-scale"
                onClick={() => window.open('https://wa.me/+254700000000')}
              >
                Contattaci su WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="hover-scale"
                onClick={() => window.open('mailto:info@villakenya.com')}
              >
                Invia una Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SafariGuide;