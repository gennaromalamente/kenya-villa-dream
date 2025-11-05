import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SetupAdmin = () => {
  const [email, setEmail] = useState("polpoepatate@gmail.com");
  const [password, setPassword] = useState("gennaro22");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { email, password }
      });

      if (error) throw error;

      toast({
        title: "Successo!",
        description: "Utente admin creato con successo. Puoi ora effettuare il login.",
      });

      // Redirect to admin page after 2 seconds
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);

    } catch (error: any) {
      console.error('Setup error:', error);
      toast({
        title: "Errore",
        description: error.message || "Errore durante la creazione dell'utente admin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Amministratore</CardTitle>
          <CardDescription>
            Crea le nuove credenziali admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creazione in corso..." : "Crea Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupAdmin;
