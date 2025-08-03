import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-700">
            Pagamento Annullato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il pagamento è stato annullato. La tua prenotazione non è stata confermata.
            Puoi riprovare quando vuoi.
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
              onClick={() => window.history.back()}
              className="w-full"
            >
              Riprova Pagamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;