import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

interface Review {
  id: string;
  guest_name: string;
  guest_location: string;
  rating: number;
  review_text: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
}

interface VillaReviewsProps {
  id?: string;
}

const VillaReviews = ({ id }: VillaReviewsProps = {}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and show empty state since no real reviews yet
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;
  const totalReviews = reviews.length;

  return (
    <section id={id} className="py-20 px-6 bg-gradient-to-br from-accent/5 to-primary/10">
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
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Caricamento recensioni...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Nessuna recensione disponibile al momento.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Sii il primo a lasciare una recensione dopo il tuo soggiorno!
              </p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <Card 
                key={review.id} 
                className="hover-lift border-0 shadow-lg overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={review.avatar_url || undefined} alt={review.guest_name} />
                      <AvatarFallback>{review.guest_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-foreground">{review.guest_name}</h4>
                        {review.is_verified && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Verificata
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{review.guest_location}</p>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('it-IT', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />
                    <blockquote className="text-muted-foreground leading-relaxed italic">
                      "{review.review_text}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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