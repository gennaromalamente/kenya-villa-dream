import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Clock, Bitcoin, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CryptoPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  
  const paymentId = searchParams.get("payment_id");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");

  // Demo crypto addresses - in production, these would be generated dynamically
  const cryptoAddresses = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH: "0x742b70B15aD6c21B5f55AC5D56B77a6e5b6F07e9",
    USDT: "0x742b70B15aD6c21B5f55AC5D56B77a6e5b6F07e9",
    LTC: "ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  };

  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof cryptoAddresses>("BTC");

  useEffect(() => {
    // Check payment status every 30 seconds
    const interval = setInterval(checkPaymentStatus, 30000);
    return () => clearInterval(interval);
  }, [paymentId]);

  const checkPaymentStatus = async () => {
    if (!paymentId) return;
    
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("status")
        .eq("transaction_id", paymentId)
        .single();
        
      if (error) throw error;
      
      if (data.status !== paymentStatus) {
        setPaymentStatus(data.status);
        if (data.status === "completed") {
          toast({
            title: "Payment Confirmed!",
            description: "Your crypto payment has been confirmed on the blockchain.",
          });
          // Redirect to success page after a delay
          setTimeout(() => {
            window.location.href = "/payment-success";
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const markAsCompleted = async () => {
    // REMOVED: This was a critical security vulnerability
    // In production, payment confirmation MUST come from:
    // 1. Blockchain verification (via CoinGate/NOWPayments webhook)
    // 2. Server-side validation with minimum confirmations (e.g., 3 for BTC)
    // 3. Never allow client-side status updates
    
    toast({
      title: "Feature Disabled",
      description: "Manual payment confirmation disabled for security. Use a real crypto gateway.",
      variant: "destructive",
    });
  };

  if (!paymentId || !amount || !currency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-6">
            <p className="text-red-500">Invalid payment link. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Bitcoin className="h-12 w-12 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Cryptocurrency Payment</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant={paymentStatus === "completed" ? "default" : "secondary"}>
                {paymentStatus === "completed" ? (
                  <><CheckCircle className="h-4 w-4 mr-1" /> Completed</>
                ) : (
                  <><Clock className="h-4 w-4 mr-1" /> Pending</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {amount} {currency.toUpperCase()}
            </div>
            <p className="text-muted-foreground">
              Payment ID: {paymentId}
            </p>
          </CardContent>
        </Card>

        {/* Crypto Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Select Cryptocurrency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(cryptoAddresses).map((crypto) => (
                <Button
                  key={crypto}
                  variant={selectedCrypto === crypto ? "default" : "outline"}
                  onClick={() => setSelectedCrypto(crypto as keyof typeof cryptoAddresses)}
                  className="h-12"
                >
                  {crypto}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Send exactly {amount} {currency.toUpperCase()} to this {selectedCrypto} address:</p>
              <div className="flex items-center gap-2 p-3 bg-white rounded border">
                <code className="flex-1 break-all text-sm">
                  {cryptoAddresses[selectedCrypto]}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto])}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>⚠️ <strong>Important:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Send only {selectedCrypto} to this address</li>
                <li>Send the exact amount shown above</li>
                <li>Payment confirmation may take 10-60 minutes</li>
                <li>Do not send from an exchange (use a personal wallet)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Production Warning */}
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-800 font-semibold mb-2">
              ⚠️ DEMO MODE - NOT FOR PRODUCTION
            </p>
            <div className="text-sm text-red-700 space-y-2">
              <p>This is a demonstration interface. For production use, you MUST integrate a real crypto payment gateway:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>CoinGate</strong> - https://coingate.com/ (Recommended)</li>
                <li><strong>NOWPayments</strong> - https://nowpayments.io/</li>
                <li><strong>Coinbase Commerce</strong> - https://commerce.coinbase.com/</li>
              </ul>
              <p className="mt-3">
                <strong>Why?</strong> Real gateways provide blockchain verification, webhook confirmations, 
                dynamic addresses, multiple confirmations, and fraud protection.
              </p>
              <p className="mt-2 text-xs">
                Manual payment confirmation has been disabled for security reasons.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="p-6 text-center">
            {paymentStatus === "pending" ? (
              <div className="space-y-2">
                <Clock className="h-8 w-8 text-blue-500 mx-auto animate-pulse" />
                <p className="font-medium">Waiting for payment confirmation...</p>
                <p className="text-sm text-muted-foreground">
                  This page will automatically update when your payment is confirmed
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <p className="font-medium text-green-700">Payment Confirmed!</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to confirmation page...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoPayment;