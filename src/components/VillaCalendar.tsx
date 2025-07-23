import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Euro, Users, Clock } from "lucide-react";

const VillaCalendar = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);

  const pricePerNight = 180; // €180 per notte
  
  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * pricePerNight;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Date non disponibili (esempio)
  const unavailableDates = [
    new Date(2024, 7, 15), // 15 agosto
    new Date(2024, 7, 16), // 16 agosto
    new Date(2024, 11, 25), // 25 dicembre
  ];

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => 
      date.toDateString() === unavailableDate.toDateString()
    );
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Calendario & Prenotazioni</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Verifica la disponibilità e prenota il tuo soggiorno nella nostra villa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Calendario Check-in */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                <span>Check-in</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={isDateUnavailable}
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
          </Card>

          {/* Calendario Check-out */}
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-accent" />
                <span>Check-out</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => isDateUnavailable(date) || (checkIn && date <= checkIn)}
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
          </Card>

          {/* Riepilogo Prenotazione */}
          <div className="space-y-6">
            <Card className="hover-lift border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Euro className="w-5 h-5 text-primary" />
                  <span>Riepilogo Prenotazione</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">€{pricePerNight}</div>
                    <div className="text-sm text-muted-foreground">per notte</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="guests">Numero Ospiti</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max="6"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">max 6</span>
                    </div>
                  </div>

                  {checkIn && checkOut && (
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Notti:</span>
                        </span>
                        <Badge variant="secondary">{calculateNights()}</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Totale:</span>
                        <span className="text-primary">€{calculateTotalPrice()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={!checkIn || !checkOut}
                >
                  {checkIn && checkOut ? "Prenota Ora" : "Seleziona le Date"}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Prenotazione sicura • Cancellazione gratuita fino a 48h prima
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-accent">Legenda Disponibilità</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Disponibile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span>Non disponibile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span>Selezionato</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaCalendar;