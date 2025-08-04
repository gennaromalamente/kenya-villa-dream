import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VillaInteriors = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative animate-fade-in">
            <Card className="overflow-hidden hover-scale">
              <CardContent className="p-0">
                <img
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop"
                  alt="Interni della villa"
                  className="w-full h-[400px] object-cover transition-transform duration-500"
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Interni
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                La Villa ha una superficie interna di oltre 500 mq, suddivisa in sei grandi ambienti di <strong>lusso</strong>: tre <strong>suite</strong>, due <strong>camere</strong> e una <strong>dépendance</strong> con vasca <strong>idromassaggio</strong> e <strong>aria condizionata</strong>.
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