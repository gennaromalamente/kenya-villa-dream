import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PayPalTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const testPayPalConfiguration = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-paypal');
      
      if (error) {
        throw error;
      }

      setTestResults(data);
      
      if (data.success) {
        toast({
          title: "PayPal Configuration Test Passed",
          description: "PayPal API connection is working correctly.",
        });
      } else {
        toast({
          title: "PayPal Configuration Test Failed",
          description: data.message || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('PayPal test error:', error);
      setTestResults({ error: error.message });
      toast({
        title: "Test Failed",
        description: `Error: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testPayPalPayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('payment-paypal', {
        body: {
          amount: 1000, // 10.00 EUR in cents
          currency: 'EUR',
          booking_id: 'test-booking-123',
          payment_method: 'paypal'
        }
      });

      if (error) {
        throw error;
      }

      if (data.approval_url) {
        window.open(data.approval_url, '_blank');
        toast({
          title: "PayPal Test Payment Created",
          description: "PayPal payment URL opened in new tab.",
        });
      }

      setTestResults({ paymentTest: data });
    } catch (error) {
      console.error('PayPal payment test error:', error);
      setTestResults({ error: error.message });
      toast({
        title: "Payment Test Failed",
        description: `Error: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>PayPal Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testPayPalConfiguration} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Testing..." : "Test PayPal Configuration"}
        </Button>
        
        <Button 
          onClick={testPayPalPayment} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? "Creating..." : "Test PayPal Payment (€10.00)"}
        </Button>

        {testResults && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayPalTest;