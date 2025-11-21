import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Clock, MessageCircle, Phone } from "lucide-react";

const FollowUpNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minuti = 300 secondi

  useEffect(() => {
    // Mostra la notifica dopo 5 minuti
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300000); // 5 minuti

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const countdown = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isVisible, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-scale-in">
      <Card className="border-primary/20 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Hai bisogno di aiuto?</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 hover:bg-accent/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Stai navigando da un po'. Se hai domande sulla villa o vuoi prenotare, 
            siamo qui per aiutarti!
          </p>

          <div className="space-y-3">
            <Button 
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open('https://wa.me/393473534639?text=Ciao! Ho visto la villa sul sito e vorrei maggiori informazioni.')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Italia
            </Button>
            
            <Button 
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open('https://wa.me/254756317357?text=Ciao! Ho visto la villa sul sito e vorrei maggiori informazioni.')}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Kenya
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('tel:+393473534639')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Chiamata Italia
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open('tel:+254756317357')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Chiamata Kenya
            </Button>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Risposta garantita entro 1 ora</span>
              {timeLeft > 0 && (
                <span className="bg-accent/20 px-2 py-1 rounded">
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUpNotification;