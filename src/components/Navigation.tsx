import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";
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
  Euro,
  Home
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const services = [
    { name: "Safari privato", icon: <MapPin className="w-4 h-4" />, price: "", link: "/safari-guide" },
    { name: "Chef Personale con Open Bar", icon: <Settings className="w-4 h-4" />, price: "" },
    { name: "Tuk Tuk con Autista Privato", icon: <MapPin className="w-4 h-4" />, price: "" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full"></div>
          <span className="font-bold text-lg text-foreground">Villa Kenya</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList className="space-x-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground">
                  Menu
                </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white/95 backdrop-blur-md border shadow-lg z-50">
                   <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] bg-white rounded-lg">
                     <div className="grid gap-2 grid-cols-2">
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => window.location.href = '/'}
                       >
                         <Home className="w-5 h-5 text-primary" />
                         <span>Home</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <Settings className="w-5 h-5 text-primary" />
                         <span>Caratteristiche</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => window.location.href = '/gallery'}
                       >
                         <Image className="w-5 h-5 text-primary" />
                         <span>Galleria Foto</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('interiors')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <Settings className="w-5 h-5 text-primary" />
                         <span>Interni</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('exteriors')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <Settings className="w-5 h-5 text-primary" />
                         <span>Esterni</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <Settings className="w-5 h-5 text-primary" />
                         <span>Attività e Servizi</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('environment')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <MapPin className="w-5 h-5 text-primary" />
                         <span>Ambiente Naturale</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <MapPin className="w-5 h-5 text-primary" />
                         <span>Posizione</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <Calendar className="w-5 h-5 text-primary" />
                         <span>Calendario</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <Star className="w-5 h-5 text-primary" />
                         <span>Recensioni</span>
                       </button>
                       <button 
                         className="flex items-center space-x-2 p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                         onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                       >
                         <Mail className="w-5 h-5 text-primary" />
                         <span>Contatti</span>
                       </button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground">
                  Scopri tutti i Servizi
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white/95 backdrop-blur-md border shadow-lg z-50">
                  <div className="grid gap-3 p-6 w-[350px] bg-white rounded-lg">
                    {services.map((service, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer text-foreground"
                        onClick={() => service.link && (window.location.href = service.link)}
                      >
                        <div className="flex items-center space-x-3">
                          {service.icon}
                          <span className="text-sm">{service.name}</span>
                        </div>
                        <Euro className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Contact Buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => window.open('mailto:info@villakenya.com')}
            >
              <Mail className="w-4 h-4" />
              <span className="hidden xl:inline">Email</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2 text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => window.open('https://wa.me/393473534639')}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xl:inline">WhatsApp</span>
            </Button>

            <Button 
              size="sm"
              className="bg-primary hover:bg-primary-dark"
              onClick={() => window.open('https://maps.google.com/search/Kenya+Villa')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span className="hidden xl:inline">Mappa</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
               <div className="flex flex-col space-y-4 mt-8">
                 <div className="text-lg font-semibold text-foreground mb-4">Menu Principale</div>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => window.location.href = '/'}
                 >
                   <Home className="w-5 h-5 text-primary" />
                   <span>Home</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#features';
                       } else {
                         document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <Settings className="w-5 h-5 text-primary" />
                   <span>Caratteristiche</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => window.location.href = '/gallery'}
                 >
                   <Image className="w-5 h-5 text-primary" />
                   <span>Galleria Foto</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#interiors';
                       } else {
                         document.getElementById('interiors')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <Settings className="w-5 h-5 text-primary" />
                   <span>Interni</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#exteriors';
                       } else {
                         document.getElementById('exteriors')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <Settings className="w-5 h-5 text-primary" />
                   <span>Esterni</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#services';
                       } else {
                         document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <Settings className="w-5 h-5 text-primary" />
                   <span>Attività e Servizi</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#environment';
                       } else {
                         document.getElementById('environment')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <MapPin className="w-5 h-5 text-primary" />
                   <span>Ambiente Naturale</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#location';
                       } else {
                         document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <MapPin className="w-5 h-5 text-primary" />
                   <span>Posizione</span>
                 </button>
                
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#calendar';
                       } else {
                         document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <Calendar className="w-5 h-5 text-primary" />
                   <span>Calendario</span>
                 </button>

                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#reviews';
                       } else {
                         document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <Star className="w-5 h-5 text-primary" />
                   <span>Recensioni</span>
                 </button>
                 
                 <button 
                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/10 transition-colors text-left"
                   onClick={() => {
                     setIsOpen(false);
                     setTimeout(() => {
                       if (window.location.pathname !== '/') {
                         window.location.href = '/#contact';
                       } else {
                         document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                       }
                     }, 100);
                   }}
                 >
                   <Mail className="w-5 h-5 text-primary" />
                   <span>Contatti</span>
                 </button>

                <div className="pt-4 border-t border-border">
                  <div className="text-lg font-semibold text-foreground mb-4">Servizi Aggiuntivi</div>
                  {services.map((service, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                      onClick={() => service.link && (window.location.href = service.link)}
                    >
                      <div className="flex items-center space-x-3">
                        {service.icon}
                        <span className="text-sm">{service.name}</span>
                      </div>
                      <Euro className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => window.open('mailto:info@villakenya.com')}
                  >
                    <Mail className="w-4 h-4 mr-3" />
                    info@villakenya.com
                  </Button>
                  
                  <Button 
                    className="w-full justify-start text-green-600 border-green-600 hover:bg-green-50"
                    variant="outline"
                    onClick={() => window.open('https://wa.me/393473534639')}
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Chat WhatsApp
                  </Button>

                  <Button 
                    className="w-full justify-start bg-primary hover:bg-primary-dark"
                    onClick={() => window.open('https://maps.google.com/search/Kenya+Villa')}
                  >
                    <MapPin className="w-4 h-4 mr-3" />
                    Visualizza su Google Maps
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;