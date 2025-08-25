import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYPAL-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // For guest checkouts, use a default user ID
    let user_id = "guest";
    let user_email = "guest@example.com";
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader !== "Bearer ") {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        if (!userError && userData.user) {
          user_id = userData.user.id;
          user_email = userData.user.email || "guest@example.com";
        }
      } catch (error) {
        // Continue as guest if auth fails
        console.log("Auth failed, continuing as guest:", error);
      }
    }

    logStep("User authenticated", { userId: user_id, email: user_email });

    const { amount, currency, booking_id, payment_method } = await req.json();

    // Validate required fields
    if (!amount || !booking_id) {
      throw new Error("Missing required fields: amount, booking_id");
    }

    logStep("Payment request", { amount, currency, booking_id, payment_method });

    // Get PayPal credentials
    const paypalCredentials = Deno.env.get("PAYPAL");
    logStep("PayPal credentials check", { hasCredentials: !!paypalCredentials });
    if (!paypalCredentials) {
      throw new Error("PayPal credentials not configured - please add PAYPAL secret in format: client_id:client_secret");
    }

    // Parse PayPal credentials (expected format: "client_id:client_secret")
    const [clientId, clientSecret] = paypalCredentials.split(":");
    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials must be in format: client_id:client_secret");
    }

    // For sandbox testing, use sandbox endpoints
    const paypalBaseUrl = "https://api.sandbox.paypal.com";
    
    // Get access token from PayPal
    const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials"
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      logStep("PayPal auth failed", { status: authResponse.status, statusText: authResponse.statusText, error: errorText });
      throw new Error(`PayPal auth error: ${authResponse.status} ${authResponse.statusText} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    
    logStep("PayPal access token obtained");

    // Create PayPal order
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: currency || 'EUR',
          value: (amount / 100).toFixed(2) // Convert cents to euros
        },
        reference_id: booking_id
      }],
      application_context: {
        return_url: `${req.headers.get("origin")}/payment-success`,
        cancel_url: `${req.headers.get("origin")}/payment-cancel`
      }
    };

    const paypalResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paypalOrder)
    });

    if (!paypalResponse.ok) {
      const errorText = await paypalResponse.text();
      logStep("PayPal order creation failed", { status: paypalResponse.status, statusText: paypalResponse.statusText, error: errorText });
      throw new Error(`PayPal API error: ${paypalResponse.status} ${paypalResponse.statusText} - ${errorText}`);
    }

    const paypalData = await paypalResponse.json();
    logStep("PayPal order created", { orderId: paypalData.id });

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user_id === "guest" ? null : user_id,
        booking_id,
        amount,
        currency: currency || 'EUR',
        payment_method: payment_method || 'paypal',
        payment_provider: 'paypal',
        transaction_id: paypalData.id,
        status: 'pending',
        metadata: { paypal_order_id: paypalData.id }
      });

    if (transactionError) {
      logStep("Transaction creation error", transactionError);
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }

    logStep("Transaction created successfully");

    // Find approval URL
    const approvalUrl = paypalData.links?.find((link: any) => link.rel === "approve")?.href;

    return new Response(JSON.stringify({
      order_id: paypalData.id,
      approval_url: approvalUrl
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in paypal payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});