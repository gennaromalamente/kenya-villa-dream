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
                  <div className="bg-gradient-to-br from-primary to-accent h-64 flex items-center justify-center">
                    <div className="text-center text-white">
                      <MapPin className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Kenya Coast</h3>
                      <p className="opacity-90">La tua villa paradisiaca</p>
                    </div>
                  </div>
                  
                  <div className="p-8 bg-white">
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