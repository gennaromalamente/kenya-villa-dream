import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, LogOut, Calendar, Users, Euro, Mail, Phone } from "lucide-react";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_nights: number;
  total_price: number;
  booking_status: string;
  special_requests?: string;
  created_at: string;
}

interface AdminUser {
  username: string;
  role: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  // Check for existing session
  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      const user = JSON.parse(adminUser);
      setUser(user);
      setIsAuthenticated(true);
      fetchBookings();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          username,
          password
        }
      });

      if (error) throw error;

      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        toast({
          title: "Login effettuato",
          description: "Benvenuto nel pannello admin"
        });
        fetchBookings();
      } else {
        toast({
          title: "Errore di login",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Errore di connessione",
        description: "Impossibile effettuare il login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUsername("");
    setPassword("");
    localStorage.removeItem('admin_user');
    setBookings([]);
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        method: 'GET'
      });

      if (error) throw error;

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le prenotazioni",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In attesa';
      case 'cancelled': return 'Annullata';
      default: return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <LogIn className="w-6 h-6" />
              <span>Pannello Admin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pannello Admin</h1>
          <div className="flex items-center space-x-4">
            <span>Benvenuto, {user?.username}</span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-muted-foreground">Prenotazioni Totali</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {bookings.filter(b => b.booking_status === 'confirmed').length}
                  </p>
                  <p className="text-muted-foreground">Confermate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Euro className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    €{bookings
                      .filter(b => b.booking_status === 'confirmed')
                      .reduce((sum, b) => sum + b.total_price, 0)
                    }
                  </p>
                  <p className="text-muted-foreground">Ricavi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Prenotazioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{booking.guest_name}</h3>
                        <Badge className={getStatusColor(booking.booking_status)}>
                          {getStatusText(booking.booking_status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Check-in:</span>
                          <p>{new Date(booking.check_in_date).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Check-out:</span>
                          <p>{new Date(booking.check_out_date).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Ospiti:</span>
                          <p>{booking.number_of_guests}</p>
                        </div>
                        <div>
                          <span className="font-medium">Totale:</span>
                          <p className="font-bold text-primary">€{booking.total_price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Modal */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Dettagli Prenotazione</DialogTitle>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Ospite</Label>
                    <p className="font-semibold">{selectedBooking.guest_name}</p>
                  </div>
                  <div>
                    <Label>Stato</Label>
                    <Badge className={getStatusColor(selectedBooking.booking_status)}>
                      {getStatusText(selectedBooking.booking_status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in</Label>
                    <p>{new Date(selectedBooking.check_in_date).toLocaleDateString('it-IT')}</p>
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <p>{new Date(selectedBooking.check_out_date).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Ospiti</Label>
                    <p>{selectedBooking.number_of_guests}</p>
                  </div>
                  <div>
                    <Label>Notti</Label>
                    <p>{selectedBooking.total_nights}</p>
                  </div>
                  <div>
                    <Label>Totale</Label>
                    <p className="text-xl font-bold text-primary">€{selectedBooking.total_price}</p>
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{selectedBooking.guest_email}</span>
                  </div>
                </div>

                {selectedBooking.guest_phone && (
                  <div>
                    <Label>Telefono</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedBooking.guest_phone}</span>
                    </div>
                  </div>
                )}

                {selectedBooking.special_requests && (
                  <div>
                    <Label>Richieste Speciali</Label>
                    <p className="bg-muted p-3 rounded">{selectedBooking.special_requests}</p>
                  </div>
                )}

                <div>
                  <Label>Data Prenotazione</Label>
                  <p>{new Date(selectedBooking.created_at).toLocaleString('it-IT')}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;