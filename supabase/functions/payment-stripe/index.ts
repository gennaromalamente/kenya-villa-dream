import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-PAYMENT] ${step}${detailsStr}`);
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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE") || "", {
      apiVersion: "2023-10-16",
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_id,
        user_id: user.id,
      },
    });

    logStep("Stripe payment intent created", { paymentIntentId: paymentIntent.id });

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user.id,
        booking_id,
        amount,
        currency: currency || 'EUR',
        payment_method: payment_method || 'stripe',
        payment_provider: 'stripe',
        transaction_id: paymentIntent.id,
        status: 'pending',
        metadata: { payment_intent_id: paymentIntent.id }
      });

    if (transactionError) {
      logStep("Transaction creation error", transactionError);
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }

    logStep("Transaction created successfully");

    return new Response(JSON.stringify({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});