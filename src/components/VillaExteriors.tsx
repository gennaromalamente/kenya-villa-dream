import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VillaExteriors = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Esterni
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Avrai a disposizione un <strong>giardino</strong> privato di 5000 mq e una <strong>piscina infinity</strong>. Il parcheggio videosorvegliato è gratuito, come lo è la ricarica per auto elettriche.
              </p>
              <p>
                Una <strong>Pergola</strong> di 60 mq e un'antica <strong>Loggia</strong> permetteranno e a te e alle persone che ti sono care di mangiare tutti insieme all'aperto. Potrete godere sempre di aria fresca, pulita e naturale, e di una <strong>vista panoramica</strong> su campi coltivati, boschi, colline, laghetti tipici della <strong>Toscana</strong>.
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
            <Card className="overflow-hidden hover-scale">
              <CardContent className="p-0">
                <img
                  src="https://images.unsplash.com/photo-1482938289607-d7adac402bff?w=600&h=400&fit=crop"
                  alt="Esterni della villa"
                  className="w-full h-[400px] object-cover transition-transform duration-500"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaExteriors;