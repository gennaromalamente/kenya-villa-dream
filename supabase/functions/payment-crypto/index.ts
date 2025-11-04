import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAXELPAY_API_KEY = Deno.env.get("MAXELPAY_API_KEY");
const MAXELPAY_SECRET_KEY = Deno.env.get("MAXELPAY_SECRET_KEY");
// MaxelPay API endpoint: https://api.maxelpay.com/v1/{environment}/merchant/order/checkout
// Use "prod" for production, "sandbox" for testing
const MAXELPAY_API_URL = "https://api.maxelpay.com/v1/prod/merchant/order/checkout";

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
    
    // INPUT VALIDATION
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error("Invalid amount: must be a positive number");
    }
    if (!currency || typeof currency !== 'string' || currency.length > 10) {
      throw new Error("Invalid currency: must be a valid currency code");
    }
    if (!booking_id || typeof booking_id !== 'string') {
      throw new Error("Invalid booking_id: required");
    }
    
    logStep("Payment request validated", { amount, currency, booking_id, payment_method });

    // Check for duplicate transactions (idempotency)
    const { data: existingTx } = await supabaseClient
      .from("transactions")
      .select("transaction_id, status")
      .eq("booking_id", booking_id)
      .eq("payment_method", "crypto")
      .eq("status", "pending")
      .maybeSingle();
    
    if (existingTx) {
      logStep("Existing pending transaction found", existingTx);
      const baseUrl = req.headers.get("origin") || "https://your-domain.com";
      return new Response(JSON.stringify({
        payment_id: existingTx.transaction_id,
        payment_url: `${baseUrl}/crypto-payment?payment_id=${existingTx.transaction_id}&amount=${amount}&currency=${currency}`,
        amount,
        currency,
        status: "pending",
        message: "Existing pending payment found"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Generate a unique payment ID
    const paymentId = crypto.randomUUID();
    
    // Check if MaxelPay credentials are configured
    if (!MAXELPAY_API_KEY || !MAXELPAY_SECRET_KEY) {
      throw new Error("MaxelPay credentials not configured");
    }

    // Prepare MaxelPay order data
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://gautcjatzseiyzxlnkra.supabase.co";
    const baseUrl = req.headers.get("origin") || supabaseUrl;
    const callbackUrl = `${supabaseUrl}/functions/v1/maxelpay-webhook`;
    const returnUrl = `${baseUrl}/payment-success?payment_id=${paymentId}`;
    
    const maxelPayOrder = {
      order_id: paymentId,
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      callback_url: callbackUrl,
      return_url: returnUrl,
      description: `Booking ${booking_id}`,
    };

    logStep("Creating MaxelPay order", { url: MAXELPAY_API_URL, order: maxelPayOrder });

    // Call MaxelPay API - Try common authentication formats
    const maxelPayResponse = await fetch(MAXELPAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAXELPAY_API_KEY}`,
        "api-key": MAXELPAY_API_KEY,
        "api-secret": MAXELPAY_SECRET_KEY,
      },
      body: JSON.stringify(maxelPayOrder),
    });

    logStep("MaxelPay response status", { 
      status: maxelPayResponse.status, 
      statusText: maxelPayResponse.statusText,
      headers: Object.fromEntries(maxelPayResponse.headers.entries())
    });

    if (!maxelPayResponse.ok) {
      const errorText = await maxelPayResponse.text();
      logStep("MaxelPay API error", { status: maxelPayResponse.status, error: errorText });
      throw new Error(`MaxelPay API error (${maxelPayResponse.status}): Check endpoint URL in dashboard. Current: ${MAXELPAY_API_URL}`);
    }

    const maxelPayData = await maxelPayResponse.json();
    logStep("MaxelPay response", maxelPayData);

    const cryptoPaymentUrl = maxelPayData.payment_url || maxelPayData.checkout_url || `${baseUrl}/crypto-payment?payment_id=${paymentId}`;

    // Insert transaction record
    const { error: insertError } = await supabaseClient
      .from("transactions")
      .insert({
        transaction_id: paymentId,
        booking_id,
        user_id: user.id === "guest" ? null : user.id,
        amount: parseFloat(amount),
        currency: currency.toUpperCase(),
        payment_method: "crypto",
        payment_provider: "maxelpay",
        status: "pending",
      });

    if (insertError) {
      logStep("Error inserting transaction", insertError);
      throw new Error(`Failed to create transaction record: ${insertError.message}`);
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