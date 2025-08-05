import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Building2, Bitcoin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

interface PaymentFormProps {
  amount: number;
  currency: string;
  bookingId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  bookingId,
  onSuccess,
  onError
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });
  const { toast } = useToast();

  const paymentMethods = [
    { id: "stripe", name: "Carta di Credito/Debito", icon: CreditCard },
    { id: "paypal", name: "PayPal", icon: Wallet },
    { id: "bank_transfer", name: "Bonifico Bancario", icon: Building2 },
    { id: "crypto", name: "Criptovalute", icon: Bitcoin }
  ];

  const handleStripePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('payment-stripe', {
        body: {
          amount,
          currency,
          booking_id: bookingId,
          payment_method: 'stripe'
        }
      });

      if (error) throw error;

      if (data.url) {
        // Redirect to Stripe Checkout session
        window.open(data.url, '_blank');
        
        toast({
          title: "Reindirizzamento Stripe",
          description: "Verrai reindirizzato a Stripe per completare il pagamento.",
        });
        
        onSuccess(data.session_id);
      } else {
        throw new Error('Errore nella creazione della sessione di pagamento');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      onError(`Errore pagamento Stripe: ${error.message}`);
    }
  };

  const handlePayPalPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('payment-paypal', {
        body: {
          amount,
          currency,
          booking_id: bookingId,
          payment_method: 'paypal'
        }
      });

      if (error) throw error;

      // Redirect to PayPal approval URL
      if (data.approval_url) {
        window.open(data.approval_url, '_blank');
        toast({
          title: "Reindirizzamento PayPal",
          description: "Verrai reindirizzato a PayPal per completare il pagamento.",
        });
      }
      
      onSuccess(data.order_id);
    } catch (error) {
      console.error('PayPal payment error:', error);
      onError(`Errore pagamento PayPal: ${error.message}`);
    }
  };

  const handleBankTransferPayment = () => {
    // Show bank transfer details
    toast({
      title: "Bonifico Bancario",
      description: "Ti verranno inviate le coordinate bancarie via email.",
    });
    onSuccess("bank_transfer_pending");
  };

  const handleCryptoPayment = () => {
    // Show crypto payment details
    toast({
      title: "Pagamento Criptovalute",
      description: "Funzionalità in fase di sviluppo.",
    });
    onError("Pagamento con criptovalute non ancora disponibile");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      switch (paymentMethod) {
        case "stripe":
          await handleStripePayment();
          break;
        case "paypal":
          await handlePayPalPayment();
          break;
        case "bank_transfer":
          handleBankTransferPayment();
          break;
        case "crypto":
          handleCryptoPayment();
          break;
        default:
          throw new Error("Metodo di pagamento non supportato");
      }
    } catch (error) {
      onError(`Errore durante il pagamento: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Metodo di Pagamento</CardTitle>
        <div className="text-center text-2xl font-bold text-primary">
          €{amount.toFixed(2)} {currency}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>Seleziona Metodo di Pagamento</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                      {method.name}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === "stripe" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="card-name">Nome Titolare</Label>
                  <Input
                    id="card-name"
                    placeholder="Mario Rossi"
                    value={cardData.name}
                    onChange={(e) => setCardData({...cardData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="card-number">Numero Carta</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="card-expiry">Scadenza</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input
                      id="card-cvc"
                      placeholder="123"
                      value={cardData.cvc}
                      onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Info */}
          {paymentMethod === "bank_transfer" && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Selezionando bonifico bancario riceverai le coordinate bancarie via email.
                Il pagamento dovrà essere effettuato entro 24 ore dalla prenotazione.
              </p>
            </div>
          )}

          {/* PayPal Info */}
          {paymentMethod === "paypal" && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Verrai reindirizzato a PayPal per completare il pagamento in modo sicuro.
              </p>
            </div>
          )}

          {/* Crypto Info */}
          {paymentMethod === "crypto" && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Accettiamo Bitcoin (BTC) e Ethereum (ETH). Funzionalità in fase di sviluppo.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing}
          >
            {isProcessing ? "Elaborazione..." : `Paga €${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;