import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VillaNaturalEnvironment = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative order-2 lg:order-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop"
                  alt="L'ambiente naturale"
                  className="w-full h-[400px] object-cover"
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              L'ambiente naturale
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                La Villa è immersa in una <strong>riserva naturale</strong>, dove è facile incontrare e conoscere, in tutta sicurezza, animali come il <strong>capriolo</strong>, la lepre, il <strong>fagiano</strong>, lo scoiattolo, la <strong>volpe</strong>.
              </p>
              <p>
                Inoltre, durante il giorno potrai osservare il volo del <strong>falco</strong> e dell' <strong>airone</strong>, mentre di notte scoprirai il fascino di uccelli notturni come il <strong>gufo</strong> e la civetta.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-6"
            >
              Scopri i dettagli
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaNaturalEnvironment;