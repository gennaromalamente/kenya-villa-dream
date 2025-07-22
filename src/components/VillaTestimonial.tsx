import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const VillaTestimonial = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Un Sogno</span> Diventato Realtà
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Non stiamo parlando di un viaggio irraggiungibile, 
            ma di una vacanza autentica, accessibile e indimenticabile
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card border-0 shadow-2xl hover-lift">
            <CardContent className="p-12 text-center">
              <Quote className="w-16 h-16 text-primary/30 mx-auto mb-8" />
              
              <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8 text-foreground">
                "Se hai sempre creduto che un viaggio così fosse fuori dal tuo budget, 
                <span className="text-gradient font-semibold"> questa è l'occasione giusta per ricrederti</span>.
                Un'esperienza africana autentica, ospitale, emozionante ed accessibile."
              </blockquote>
              
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              
              <div className="bg-primary/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Perché Scegliere la Nostra Villa?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <span className="text-muted-foreground">Prezzo accessibile, qualità premium</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <span className="text-muted-foreground">Esperienza autentica del Kenya</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <span className="text-muted-foreground">Comfort moderno in stile coloniale</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <span className="text-muted-foreground">Posizione strategica mare-cultura</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VillaTestimonial;