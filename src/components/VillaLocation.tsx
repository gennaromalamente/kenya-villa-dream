import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Waves, Palmtree } from "lucide-react";

const VillaLocation = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-accent/10 to-primary/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              <span className="text-gradient">Posizione</span> da Sogno
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Waves className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Mare Cristallino</h3>
                  <p className="text-muted-foreground">
                    A soli 10 minuti a piedi ti aspetta una spiaggia con acque turchesi 
                    e sabbia fine, perfetta per rilassarsi al sole africano.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Palmtree className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cultura Autentica</h3>
                  <p className="text-muted-foreground">
                    Con un breve tragitto in tuk tuk scopri ristoranti locali, 
                    mercati colorati e la vera ospitalità keniana.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Camera className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Paesaggi Mozzafiato</h3>
                  <p className="text-muted-foreground">
                    Tramonti indimenticabili, palme che danzano al vento 
                    e panorami che ti lasceranno senza parole.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Esplora la Zona
            </Button>
          </div>
          
          <div className="animate-scale-in">
            <Card className="overflow-hidden shadow-2xl hover-lift">
              <CardContent className="p-0">
                <div className="relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31724.82!2d39.6692!3d-4.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDInMzYuNiJTIDM5wrA0MCcwOS4xIkU!5e0!3m2!1sit!2sit!4v1"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Villa Kenya Location"
                    className="rounded-t-lg"
                  />
                  
                  <div className="p-8 bg-white">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-primary mb-2">Kenya Coast</h3>
                      <p className="text-muted-foreground">La tua villa paradisiaca</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">10 min</div>
                        <div className="text-sm text-muted-foreground">alla spiaggia</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">5 min</div>
                        <div className="text-sm text-muted-foreground">al centro</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">240 m²</div>
                        <div className="text-sm text-muted-foreground">di comfort</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">28°C</div>
                        <div className="text-sm text-muted-foreground">tutto l'anno</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <a 
                        href="https://maps.app.goo.gl/1kaxXxzV4v7V2wLc7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Apri in Google Maps</span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaLocation;