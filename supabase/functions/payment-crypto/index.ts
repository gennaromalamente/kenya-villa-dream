import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CRYPTO-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header or default to guest
    let user = { id: "guest", email: "guest@example.com" };
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseClient.auth.getUser(token);
        if (userData.user) {
          user = userData.user;
        }
      } catch (authError) {
        logStep("Auth failed, using guest", authError);
      }
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { amount, currency, booking_id, payment_method } = await req.json();
    logStep("Payment request", { amount, currency, booking_id, payment_method });

    // Generate a unique payment ID
    const paymentId = crypto.randomUUID();
    
    // For demo purposes, we'll create a simple crypto payment URL
    // In production, you'd integrate with services like:
    // - CoinGate (https://coingate.com/)
    // - BitPay (https://bitpay.com/)
    // - Coinbase Commerce (https://commerce.coinbase.com/)
    // - NOWPayments (https://nowpayments.io/)
    
    const baseUrl = req.headers.get("origin") || "https://your-domain.com";
    const cryptoPaymentUrl = `${baseUrl}/crypto-payment?payment_id=${paymentId}&amount=${amount}&currency=${currency}`;

    // Insert transaction record
    const { error: insertError } = await supabaseClient
      .from("transactions")
      .insert({
        transaction_id: paymentId,
        booking_id,
        user_id: user.id,
        user_email: user.email,
        amount: parseFloat(amount),
        currency: currency.toUpperCase(),
        payment_method: "crypto",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      logStep("Error inserting transaction", insertError);
      throw new Error("Failed to create transaction record");
    }

    logStep("Transaction created", { paymentId });

    return new Response(JSON.stringify({
      payment_id: paymentId,
      payment_url: cryptoPaymentUrl,
      amount,
      currency,
      status: "pending"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in crypto payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});