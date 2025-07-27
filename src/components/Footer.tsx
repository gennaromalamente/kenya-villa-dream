import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Globe,
  Shield,
  Eye,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [acceptGdpr, setAcceptGdpr] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptGdpr) {
      alert("Devi accettare la privacy policy per iscriverti alla newsletter");
      return;
    }
    // Qui gestiresti l'iscrizione alla newsletter
    alert("Iscrizione completata! Ti contatteremo presto.");
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/90 text-background">
      <div className="container mx-auto px-6">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-background/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Resta Aggiornato</h3>
            <p className="text-background/80 mb-6">
              Iscriviti alla nostra newsletter per offerte esclusive e aggiornamenti sulla villa
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="La tua email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background/10 border-background/30 text-background placeholder:text-background/60"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-dark text-foreground font-semibold"
                >
                  Iscriviti
                </Button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="gdpr" 
                    checked={acceptGdpr}
                    onCheckedChange={(checked) => setAcceptGdpr(checked === true)}
                    className="border-background/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="gdpr" className="text-background/80 leading-tight">
                    Accetto la <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> e 
                    il trattamento dei miei dati personali secondo il GDPR
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="cookies" 
                    checked={acceptCookies}
                    onCheckedChange={(checked) => setAcceptCookies(checked === true)}
                    className="border-background/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <label htmlFor="cookies" className="text-background/80 leading-tight">
                    Accetto l'utilizzo dei <a href="/cookies" className="text-accent hover:underline">Cookie</a> per 
                    migliorare l'esperienza di navigazione
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Villa Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></div>
              <span className="font-bold text-xl">Villa Kenya</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              La tua villa da sogno in Kenya. Comfort, eleganza e autenticità africana 
              per una vacanza indimenticabile.
            </p>
            
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/10">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-background hover:bg-background/10">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Contatti */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contatti</h4>
            <div className="space-y-3">
              <a 
                href="mailto:info@villakenya.com" 
                className="flex items-center space-x-3 text-background/80 hover:text-background transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
                <span>info@villakenya.com</span>
              </a>
              
              <a 
                href="https://wa.me/+254700000000" 
                className="flex items-center space-x-3 text-background/80 hover:text-background transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span>Chat WhatsApp</span>
              </a>
              
              <a 
                href="tel:+254700000000" 
                className="flex items-center space-x-3 text-background/80 hover:text-background transition-colors"
              >
                <Phone className="w-5 h-5 text-accent" />
                <span>+254 700 000 000</span>
              </a>
              
              <a 
                href="https://maps.google.com/search/Kenya+Villa" 
                className="flex items-center space-x-3 text-background/80 hover:text-background transition-colors"
              >
                <MapPin className="w-5 h-5 text-primary" />
                <span>Visualizza su Google Maps</span>
              </a>
            </div>
          </div>


          {/* Hosting Partner */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Hosting Partner</h4>
            <div className="space-y-3">
              <a 
                href="https://ionos.it" 
                className="flex items-center space-x-3 text-background/80 hover:text-background transition-colors"
              >
                <Globe className="w-5 h-5 text-accent" />
                <span>Powered by IONOS</span>
              </a>
              
              <div className="flex items-center space-x-3 text-background/80">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Sicurezza Certificata</span>
              </div>
              
              <div className="flex items-center space-x-3 text-background/80">
                <Eye className="w-5 h-5 text-primary" />
                <span>GDPR Compliant</span>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-xs text-background/60">
                Questo sito utilizza cookie per migliorare l'esperienza utente. 
                Continuando la navigazione accetti l'utilizzo dei cookie.
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-background/20" />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-background/60">
          <div>
            © 2024 Villa Kenya. Tutti i diritti riservati.
          </div>
          
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="/privacy" className="hover:text-background transition-colors">
              Privacy Policy
            </a>
            <a href="/cookies" className="hover:text-background transition-colors">
              Cookie Policy
            </a>
            <a href="/termini" className="hover:text-background transition-colors">
              Termini di Servizio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;