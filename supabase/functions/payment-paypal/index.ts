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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { amount, currency, booking_id, payment_method } = await req.json();

    // Validate required fields
    if (!amount || !booking_id) {
      throw new Error("Missing required fields: amount, booking_id");
    }

    logStep("Payment request", { amount, currency, booking_id, payment_method });

    // Get PayPal access token
    const paypalClientId = Deno.env.get("PAYPAL");
    if (!paypalClientId) {
      throw new Error("PayPal credentials not configured");
    }

    // For sandbox testing, use sandbox endpoints
    const paypalBaseUrl = "https://api.sandbox.paypal.com";

    // Create PayPal order
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: currency || 'EUR',
          value: amount.toString()
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
        "Authorization": `Bearer ${paypalClientId}`,
      },
      body: JSON.stringify(paypalOrder)
    });

    if (!paypalResponse.ok) {
      throw new Error(`PayPal API error: ${paypalResponse.statusText}`);
    }

    const paypalData = await paypalResponse.json();
    logStep("PayPal order created", { orderId: paypalData.id });

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user.id,
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