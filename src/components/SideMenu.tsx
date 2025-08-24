import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Calendar,
  Image,
  Settings,
  Star,
  Euro
} from "lucide-react";

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Galleria Foto", icon: <Image className="w-5 h-5" />, action: () => {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }},
    { name: "Calendario Disponibilità", icon: <Calendar className="w-5 h-5" />, action: () => {
      document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }},
    { name: "Recensioni", icon: <Star className="w-5 h-5" />, action: () => {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }},
  ];

  const services = [
    { name: "Safari privato", icon: <MapPin className="w-5 h-5" />, link: "/safari-guide" },
    { name: "Chef Personale con Open Bar", icon: <Settings className="w-5 h-5" /> },
    { name: "Tuk Tuk con Autista Privato", icon: <MapPin className="w-5 h-5" /> },
  ];

  const contactActions = [
    { name: "Email", icon: <Mail className="w-5 h-5" />, action: () => window.open('mailto:info@villakenya.com') },
    { name: "WhatsApp", icon: <MessageCircle className="w-5 h-5" />, action: () => window.open('https://wa.me/+254700000000'), color: "text-green-600" },
    { name: "Mappa", icon: <MapPin className="w-5 h-5" />, action: () => window.open('https://maps.google.com/search/Kenya+Villa') },
  ];

  return (
    <div className="fixed left-4 top-24 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white rounded-full p-4 shadow-lg"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white">
          <div className="flex flex-col space-y-6 mt-8">
            {/* Logo */}
            <div className="flex items-center space-x-3 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full"></div>
              <span className="font-bold text-xl text-foreground">Villa Kenya</span>
            </div>

            {/* Menu Principale */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Menu Principale</h3>
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left w-full text-foreground"
                  >
                    <span className="text-primary">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Servizi Aggiuntivi */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Servizi Aggiuntivi</h3>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer text-foreground"
                    onClick={() => {
                      if (service.link) {
                        window.location.href = service.link;
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-primary">{service.icon}</span>
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <Euro className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Contatti */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Contatti</h3>
              <div className="space-y-3">
                {contactActions.map((contact, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start ${contact.color || ''}`}
                    onClick={() => {
                      contact.action();
                      setIsOpen(false);
                    }}
                  >
                    <span className="mr-3">{contact.icon}</span>
                    {contact.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SideMenu;