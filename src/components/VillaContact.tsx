import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const VillaContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Messaggio Inviato!",
      description: "Ti contatteremo presto per realizzare il tuo sogno keniano.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Contattaci</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Siamo qui per aiutarti a organizzare la tua vacanza perfetta in Kenya.
            Il tuo rifugio tropicale ti aspetta.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in-up">
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">
                  <span className="text-gradient">Contattaci Subito</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chiamaci</h3>
                    <p className="text-muted-foreground">+39 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                  <div className="bg-accent/20 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scrivici</h3>
                    <p className="text-muted-foreground">info@villakenya.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="text-muted-foreground">Risposta immediata</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center p-8 glass-card rounded-2xl">
              <h3 className="text-xl font-bold mb-4 text-gradient">
                Pronto per Partire?
              </h3>
              <p className="text-muted-foreground mb-6">
                Ogni giorno che passa è un giorno in meno per vivere 
                l'esperienza della tua vita in Kenya.
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <span className="text-2xl font-bold text-primary">
                  Disponibilità Limitata
                </span>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <Card className="hover-lift border-0 shadow-2xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Richiedi Informazioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Il tuo nome"
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="la.tua@email.com"
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+39 123 456 789"
                    className="border-primary/30 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Raccontaci del tuo sogno keniano... Quando vorresti partire? Quante persone siete?"
                    rows={4}
                    className="border-primary/30 focus:border-primary resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary-dark text-foreground font-bold py-6 rounded-full hover-lift"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Invia Richiesta
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VillaContact;