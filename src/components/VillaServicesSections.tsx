import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VillaServicesSections = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative animate-fade-in">
            <Card className="overflow-hidden hover-scale">
              <CardContent className="p-0">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                  alt="Servizi della villa"
                  className="w-full h-[400px] object-cover transition-transform duration-500"
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Attività e servizi
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Le nostre Ville in Kenya sono pensate per chi cerca un rifugio esclusivo, dove ogni dettaglio può essere personalizzato. Dalla magia di una cena preparata dal tuo chef privato, al relax di massaggi rigeneranti direttamente in villa, fino all'emozione di un tour privato nella savana africana: ogni esperienza è creata su misura per te.
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

export default VillaServicesSections;