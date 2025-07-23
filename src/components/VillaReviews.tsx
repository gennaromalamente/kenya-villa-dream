import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Marco & Sofia",
    location: "Milano, Italia",
    avatar: "/lovable-uploads/383e09f1-942a-48d4-8193-b09a46867114.png",
    rating: 5,
    date: "Agosto 2024",
    review: "Esperienza incredibile! La villa è esattamente come nelle foto, anzi meglio. I pavimenti in Niru e Galana sono uno spettacolo, le lavorazioni africane danno un tocco autentico unico. La sicurezza H24 ci ha fatto sentire tranquilli.",
    verified: true
  },
  {
    name: "Giulia Romano",
    location: "Roma, Italia", 
    avatar: "/lovable-uploads/e4c176d8-b0ea-45c7-aa9e-188efad701b1.png",
    rating: 5,
    date: "Luglio 2024",
    review: "La vista mare dalla veranda è mozzafiato! Ogni mattina mi svegliavo con questa vista paradisiaca. Il servizio chef personale è stato fantastico, abbiamo gustato specialità locali eccezionali. Consigliatissimo!",
    verified: true
  },
  {
    name: "Francesco & Anna",
    location: "Torino, Italia",
    avatar: "/lovable-uploads/7c90a53a-f01f-4c57-9f34-90dfa2c6ca46.png", 
    rating: 5,
    date: "Giugno 2024",
    review: "Il giardino con i lettini è perfetto per rilassarsi dopo le giornate in spiaggia. La villa è spaziosa, pulita e con tutti i comfort. Il WiFi funziona perfettamente. Torneremo sicuramente!",
    verified: true
  },
  {
    name: "Luca Martinelli",
    location: "Firenze, Italia",
    avatar: "/lovable-uploads/65d4f2f3-cb6a-4281-913b-1a5346bab970.png",
    rating: 5,
    date: "Maggio 2024", 
    review: "L'architettura coloniale gialla è splendida, immersa nel verde con le palme. Il servizio tuk tuk ci ha permesso di esplorare la cultura locale facilmente. Rapporto qualità-prezzo imbattibile per un'esperienza africana autentica.",
    verified: true
  }
];

const VillaReviews = () => {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-accent/5 to-primary/10">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Recensioni</span> degli Ospiti
          </h2>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-6 h-6 ${i < Math.floor(averageRating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <div className="text-xl font-semibold text-foreground">
              {averageRating.toFixed(1)} su 5
            </div>
            <Badge variant="secondary" className="text-sm">
              {totalReviews} recensioni
            </Badge>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Quello che dicono i nostri ospiti sulla loro esperienza nella villa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Card 
              key={index} 
              className="hover-lift border-0 shadow-lg overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      {review.verified && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          Verificata
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.location}</p>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <blockquote className="text-muted-foreground leading-relaxed italic">
                    "{review.review}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-primary/20">
            <h4 className="text-xl font-bold text-primary mb-4">
              Condividi la Tua Esperienza
            </h4>
            <p className="text-muted-foreground mb-4">
              Hai soggiornato nella nostra villa? Lascia una recensione e aiuta altri viaggiatori 
              a scoprire questa esperienza unica in Kenya.
            </p>
            <div className="flex justify-center space-x-1 text-2xl">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaReviews;