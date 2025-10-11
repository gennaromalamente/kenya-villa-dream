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
import { useErrorConsole } from "@/contexts/ErrorConsoleContext";
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
  const { addLog } = useErrorConsole();

  const paymentMethods = [
    { id: "stripe", name: "Carta di Credito/Debito", icon: CreditCard },
    { id: "bank_transfer", name: "Bonifico Bancario", icon: Building2 },
    { id: "crypto", name: "Criptovalute", icon: Bitcoin }
  ];

  const handleStripePayment = async () => {
    try {
      addLog('info', 'Stripe Payment', `Initiating Stripe payment for booking ${bookingId}`, {
        amount,
        currency,
        booking_id: bookingId
      });

      const { data, error } = await supabase.functions.invoke('payment-stripe', {
        body: {
          amount,
          currency,
          booking_id: bookingId,
          payment_method: 'stripe',
          redirect_base: window.location.origin
        }
      });

      if (error) {
        addLog('error', 'Stripe Payment', 'Stripe function invocation failed', error);
        throw error;
      }

      addLog('info', 'Stripe Payment', 'Stripe function response received', data);

      if (data.url) {
        addLog('info', 'Stripe Payment', `Redirecting to Stripe checkout: ${data.url}`);
        // Redirect to Stripe Checkout session
        window.location.href = data.url;
        toast({
          title: "Reindirizzamento Stripe",
          description: "Verrai reindirizzato a Stripe per completare il pagamento.",
        });
        
        onSuccess(data.session_id);
      } else {
        const errorMsg = 'Errore nella creazione della sessione di pagamento';
        addLog('error', 'Stripe Payment', errorMsg, data);
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog('error', 'Stripe Payment', `Payment failed: ${errorMessage}`, error);
      onError(`Errore pagamento Stripe: ${errorMessage}`);
    }
  };


  const handleBankTransferPayment = () => {
    addLog('info', 'Bank Transfer', 'Bank transfer payment initiated', { bookingId });
    // Show bank transfer details
    toast({
      title: "Bonifico Bancario",
      description: "Ti verranno inviate le coordinate bancarie via email.",
    });
    onSuccess("bank_transfer_pending");
  };

  const handleCryptoPayment = async () => {
    try {
      addLog('info', 'Crypto Payment', 'Initiating crypto payment', { bookingId });
      
      const { data, error } = await supabase.functions.invoke('payment-crypto', {
        body: { 
          amount,
          currency: currency.toLowerCase(),
          booking_id: bookingId,
          payment_method: 'crypto'
        }
      });
      
      if (error) {
        addLog('error', 'Crypto Payment', 'Crypto function invocation failed', error);
        throw error;
      }
      
      addLog('info', 'Crypto Payment', 'Crypto function response received', data);
      
      // Open crypto payment page in new tab
      window.open(data.payment_url, '_blank');
      
      toast({
        title: "Pagamento Criptovalute Avviato",
        description: "Completa il pagamento nella nuova scheda. Aggiorneremo la prenotazione una volta confermato.",
      });
      
      onSuccess(data.payment_id);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog('error', 'Crypto Payment', `Payment failed: ${errorMessage}`, error);
      onError(`Errore pagamento crypto: ${errorMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      addLog('info', 'Payment Form', `Starting payment process with method: ${paymentMethod}`, {
        paymentMethod,
        bookingId,
        amount
      });

      switch (paymentMethod) {
        case "stripe":
          await handleStripePayment();
          break;
        case "bank_transfer":
          handleBankTransferPayment();
          break;
        case "crypto":
          await handleCryptoPayment();
          break;
        default:
          const errorMsg = "Metodo di pagamento non supportato";
          addLog('error', 'Payment Form', errorMsg, { paymentMethod });
          throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog('error', 'Payment Form', `Payment process failed: ${errorMessage}`, error);
      onError(`Errore durante il pagamento: ${errorMessage}`);
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