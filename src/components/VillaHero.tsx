import { Button } from "@/components/ui/button";
import { MapPin, Home, Users, ChevronLeft, ChevronRight } from "lucide-react";
import villaHero from "@/assets/villa-hero.jpg";
import { useState } from "react";

const VillaHero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/lovable-uploads/6a0ff0a7-6bc3-45a4-9938-19bbdaece808.png",
    "/lovable-uploads/43f1abf4-a73b-4fa5-8d64-d8445f573a35.png"
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="villa-hero relative pt-16">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="floating-element mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              La Tua Villa da Sogno
              <span className="block text-white text-4xl md:text-6xl mt-2">
                in Kenya
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in-up [animation-delay:0.2s]">
            240 metri quadri di comfort, eleganza e autenticità africana.<br />
            <span className="text-primary-light font-semibold">
              Un rifugio esotico senza il prezzo di un resort
            </span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in-up [animation-delay:0.4s]">
            <div className="glass-card p-4 rounded-xl">
              <Home className="w-8 h-8 text-primary-light mx-auto mb-2" />
              <span className="text-white font-semibold">3 Camere Patronali</span>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <MapPin className="w-8 h-8 text-accent-light mx-auto mb-2" />
              <span className="text-white font-semibold">10 min dalla Spiaggia</span>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <Users className="w-8 h-8 text-primary-light mx-auto mb-2" />
              <span className="text-white font-semibold">Fino a 6 Ospiti</span>
            </div>
          </div>
          
          <div className="animate-scale-in [animation-delay:0.6s]">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-foreground font-bold px-12 py-6 text-xl rounded-full hover-lift shadow-2xl"
            >
              Scopri la Tua Vacanza da Sogno
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scorri per scoprire di più</span>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaHero;