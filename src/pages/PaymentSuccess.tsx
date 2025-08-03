import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Pagamento Completato!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il tuo pagamento è stato elaborato con successo. 
            Riceverai una email di conferma con tutti i dettagli della prenotazione.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Torna alla Home
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/transactions")}
              className="w-full"
            >
              Visualizza Transazioni
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;