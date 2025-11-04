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
import { User, Session } from "@supabase/supabase-js";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  status: string;
  special_requests?: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role after state update
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsCheckingAuth(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        setIsAdmin(false);
        toast({
          title: "Accesso negato",
          description: "Privilegi amministratore richiesti",
          variant: "destructive"
        });
      } else {
        setIsAdmin(true);
        fetchBookings();
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Errore di login",
          description: "Credenziali non valide",
          variant: "destructive"
        });
      } else if (data.session) {
        toast({
          title: "Login effettuato",
          description: "Benvenuto nel pannello admin"
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      setBookings([]);
      toast({
        title: "Logout effettuato",
        description: "Arrivederci!"
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Errore",
        description: "Errore durante il logout",
        variant: "destructive"
      });
    }
  };

  const fetchBookings = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (data?.success) {
        setBookings(data.bookings || []);
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
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confermata';
      case 'pending': return 'In attesa';
      case 'cancelled': return 'Annullata';
      case 'completed': return 'Completata';
      default: return status;
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <p>Verifica autenticazione...</p>
      </div>
    );
  }

  if (!isAdmin) {
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            <span>Benvenuto, {user?.email}</span>
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
                    {bookings.filter(b => b.status === 'confirmed').length}
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
                      .filter(b => b.status === 'confirmed')
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
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Check-in:</span>
                          <p>{new Date(booking.check_in).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Check-out:</span>
                          <p>{new Date(booking.check_out).toLocaleDateString('it-IT')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Ospiti:</span>
                          <p>{booking.guests_count}</p>
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
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {getStatusText(selectedBooking.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in</Label>
                    <p>{new Date(selectedBooking.check_in).toLocaleDateString('it-IT')}</p>
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <p>{new Date(selectedBooking.check_out).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Ospiti</Label>
                    <p>{selectedBooking.guests_count}</p>
                  </div>
                  <div>
                    <Label>Notti</Label>
                    <p>{calculateNights(selectedBooking.check_in, selectedBooking.check_out)}</p>
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