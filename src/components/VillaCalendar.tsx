import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Euro, Users, Clock, Loader2 } from "lucide-react";
import PaymentForm from "./PaymentForm";

interface BookingFormData {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
}

interface VillaCalendarProps {
  id?: string;
}

const VillaCalendar = ({ id }: VillaCalendarProps = {}) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string>("");
  const { toast } = useToast();
  
  const form = useForm<BookingFormData>();

  const pricePerNight = 180; // €180 per notte

  // Load unavailable dates from database
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const { data, error } = await supabase
          .from('availability')
          .select('date, is_available')
          .eq('is_available', false);

        if (error) throw error;

        const unavailable = data?.map(item => new Date(item.date)) || [];
        setUnavailableDates(unavailable);
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadAvailability();
  }, []);
  
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

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => 
      date.toDateString() === unavailableDate.toDateString()
    );
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!checkIn || !checkOut) return;
    
    // Validate check-out is after check-in
    if (checkOut <= checkIn) {
      toast({
        title: "Date non valide",
        description: "La data di check-out deve essere successiva alla data di check-in.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Sending booking request:', {
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        guest_phone: data.guest_phone,
        check_in: checkIn.toISOString().split('T')[0],
        check_out: checkOut.toISOString().split('T')[0],
        guests_count: guests,
        special_requests: data.special_requests,
      });

      const { data: result, error } = await supabase.functions.invoke('booking-system', {
        body: {
          guest_name: data.guest_name,
          guest_email: data.guest_email,
          guest_phone: data.guest_phone,
          check_in: checkIn.toISOString().split('T')[0],
          check_out: checkOut.toISOString().split('T')[0],
          guests_count: guests,
          special_requests: data.special_requests,
        }
      });

      console.log('Booking response:', result, error);

      if (error) throw error;

      toast({
        title: "Prenotazione registrata!",
        description: `Procedi ora con il pagamento per confermare.`,
      });
      
      setCurrentBookingId(result?.booking_id || "");
      setIsBookingModalOpen(false);
      setShowPaymentForm(true);
      
      // Reload availability after booking
      const { data: availabilityData } = await supabase
        .from('availability')
        .select('date, is_available')
        .eq('is_available', false);
      
      const unavailable = availabilityData?.map(item => new Date(item.date)) || [];
      setUnavailableDates(unavailable);
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Errore nella prenotazione",
        description: error?.message || "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id={id} className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">Calendario & Prenotazioni</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Verifica la disponibilità e prenota il tuo soggiorno nella nostra villa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
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
                  disabled={!checkIn || !checkOut || (checkOut && checkIn && checkOut <= checkIn)}
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  {checkIn && checkOut && checkOut > checkIn ? "Prenota Ora" : "Seleziona le Date"}
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

      {/* Modal Prenotazione */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Completa la tua prenotazione</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleBookingSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <p className="text-sm text-muted-foreground">{checkIn?.toLocaleDateString('it-IT')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <p className="text-sm text-muted-foreground">{checkOut?.toLocaleDateString('it-IT')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ospiti</p>
                  <p className="text-sm text-muted-foreground">{guests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Totale</p>
                  <p className="text-lg font-bold text-primary">€{calculateTotalPrice()}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="guest_name"
                rules={{ required: "Nome e cognome richiesti" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome e Cognome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario Rossi" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest_email"
                rules={{ 
                  required: "Email richiesta",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email non valida"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="mario@email.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guest_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="+39 123 456 7890" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="special_requests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Richieste Speciali</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Eventuali richieste particolari..." 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1"
                >
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Prenotando...
                    </>
                  ) : (
                    "Conferma Prenotazione"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Completa il Pagamento</DialogTitle>
            </DialogHeader>
            <PaymentForm
              amount={calculateTotalPrice()}
              currency="EUR"
              bookingId={currentBookingId}
              onSuccess={(transactionId) => {
                console.log("Payment successful:", transactionId);
                setShowPaymentForm(false);
                form.reset();
                setCheckIn(undefined);
                setCheckOut(undefined);
                setGuests(2);
                toast({
                  title: "Pagamento completato!",
                  description: "La prenotazione è stata confermata con successo!",
                });
              }}
              onError={(error) => {
                console.error("Payment error:", error);
                toast({
                  title: "Errore pagamento",
                  description: error,
                  variant: "destructive",
                });
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};

export default VillaCalendar;