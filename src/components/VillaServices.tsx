import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  ChefHat, 
  MapPin, 
  Euro, 
  Wifi, 
  Shield, 
  Home, 
  Utensils,
  Bath,
  Bed
} from "lucide-react";

const services = [
  {
    icon: <Car className="w-8 h-8" />,
    title: "Servizio Navetta",
    description: "Transfer comodo dall'aeroporto alla villa e per le escursioni",
    category: "Trasporti",
    color: "primary"
  },
  {
    icon: <ChefHat className="w-8 h-8" />,
    title: "Chef Personale con Open Bar",
    description: "Chef privato per cene esclusive con bevande illimitate",
    category: "Gastronomia", 
    color: "accent"
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Tuk Tuk con Autista Privato",
    description: "Esplora il Kenya autentico con il tuo autista locale",
    category: "Trasporti",
    color: "primary"
  }
];

const includedFeatures = [
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "WiFi Gratuito",
    description: "Connessione ad alta velocità in tutta la villa"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Sicurezza H24",
    description: "Servizio di sicurezza attivo 24 ore su 24"
  },
  {
    icon: <Home className="w-6 h-6" />,
    title: "Pavimento in Niru",
    description: "Materiali locali di alta qualità negli spazi comuni"
  },
  {
    icon: <Bed className="w-6 h-6" />,
    title: "Pavimento in Galana",
    description: "Camera da letto con pavimenti in pietra locale Galana"
  },
  {
    icon: <Utensils className="w-6 h-6" />,
    title: "Lavorazioni Tipiche Africane",
    description: "Arredi e decorazioni autentiche del Kenya"
  },
  {
    icon: <Bath className="w-6 h-6" />,
    title: "2 Bagni Privati",
    description: "Ogni camera con bagno privato e comfort moderni"
  }
];

const VillaServices = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Servizi</span> Esclusivi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rendi la tua vacanza indimenticabile con i nostri servizi premium opzionali
          </p>
        </div>

        {/* Servizi Premium a Pagamento */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Servizi Premium <Badge variant="secondary" className="ml-2">A richiesta</Badge>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover-lift border-0 shadow-lg overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${
                      service.color === 'primary' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                    }`}>
                      {service.icon}
                    </div>
                    <Euro className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {service.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Servizi Inclusi */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">
            Servizi Inclusi <Badge variant="default" className="ml-2 bg-green-600">Gratuiti</Badge>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {includedFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="border-green-200 hover:border-green-300 transition-colors group"
              >
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-accent/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h4 className="text-xl font-bold text-accent mb-4">
              Personalizza la Tua Esperienza
            </h4>
            <p className="text-muted-foreground mb-4">
              Tutti i servizi premium possono essere prenotati direttamente con noi. 
              Contattaci per prezzi personalizzati e pacchetti su misura.
            </p>
            <div className="text-sm text-muted-foreground">
              💰 Prezzi competitivi • 🤝 Servizio personalizzato • ✅ Qualità garantita
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaServices;