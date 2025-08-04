import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VillaServicesSections = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Attività e servizi
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                A <strong>Villa Le Ginepraie</strong> tutte le esperienze e tutti i servizi sono personalizzati. Il proprietario <strong>Valerio</strong> è a tua disposizione, perché vive proprio a fianco.
              </p>
              <p>
                Potrai chiedere la <strong>spesa a domicilio</strong>, ma anche uno <strong>chef</strong> e un <strong>pizzaiolo</strong> dedicati. Oltre ai servizi che tipicamente trovi in Toscana, puoi chiedere <strong>massaggi</strong>, lezioni di <strong>yoga</strong>, lezioni di <strong>respirazione</strong>, tutto sempre individualizzato e adattato alle tue esigenze.
              </p>
              <p>
                Inoltre, ti sarà proposto uno sguardo diverso e creativo sulla fauna e flora locali, e altre particolarità.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-6"
            >
              Scopri i dettagli
            </Button>
          </div>
          <div className="relative">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                  alt="Servizi della villa"
                  className="w-full h-[400px] object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaServicesSections;