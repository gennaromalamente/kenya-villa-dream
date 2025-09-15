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

    const { amount, currency, booking_id, payment_method, redirect_base } = await req.json();

    // Validate required fields
    if (!amount || !booking_id) {
      throw new Error("Missing required fields: amount, booking_id");
    }

    logStep("Payment request", { amount, currency, booking_id, payment_method });

    // Determine redirect base URL
    const headerOrigin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";
    let inferredOrigin = headerOrigin;
    if (!inferredOrigin && referer) {
      try { inferredOrigin = new URL(referer).origin; } catch (_e) {}
    }
    const envOrigin = Deno.env.get("WEBSITE_ORIGIN") || "";
    const baseUrl = (redirect_base || envOrigin || inferredOrigin || "https://qivroruezcxdnueuojkg.supabase.co").replace(/\/+$/, "");

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE") || "", {
      apiVersion: "2023-10-16",
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user_email,
      line_items: [
        {
          price_data: {
            currency: currency || 'eur',
            product_data: {
              name: `Prenotazione Villa - ${booking_id}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment-cancel`,
      metadata: {
        booking_id,
        user_id: user_id,
      },
    });

    logStep("Stripe checkout session created", { sessionId: session.id });

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user_id === "guest" ? null : user_id,
        booking_id,
        amount,
        currency: currency || 'EUR',
        payment_method: payment_method || 'stripe',
        payment_provider: 'stripe',
        transaction_id: session.id,
        status: 'pending',
        metadata: { session_id: session.id }
      });

    if (transactionError) {
      logStep("Transaction creation error", transactionError);
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }

    logStep("Transaction created successfully");

    return new Response(JSON.stringify({
      url: session.url,
      session_id: session.id
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