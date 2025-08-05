import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYPAL-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    logStep("Webhook body", body);

    // Handle PayPal webhook events
    const eventType = body.event_type;
    
    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      const orderId = body.resource.id;
      logStep("Order approved", { orderId });

      // Update transaction status to approved
      const { error: updateError } = await supabaseClient
        .from("transactions")
        .update({ 
          status: "approved",
          updated_at: new Date().toISOString()
        })
        .eq("transaction_id", orderId);

      if (updateError) {
        logStep("Error updating transaction", updateError);
      } else {
        logStep("Transaction updated to approved");
      }
    }

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const orderId = body.resource.supplementary_data?.related_ids?.order_id;
      logStep("Payment captured", { orderId });

      // Update transaction status to completed
      const { error: updateError } = await supabaseClient
        .from("transactions")
        .update({ 
          status: "completed",
          updated_at: new Date().toISOString()
        })
        .eq("transaction_id", orderId);

      if (updateError) {
        logStep("Error updating transaction", updateError);
      } else {
        logStep("Transaction updated to completed");
        
        // Update booking status
        const { data: transaction } = await supabaseClient
          .from("transactions")
          .select("booking_id")
          .eq("transaction_id", orderId)
          .single();

        if (transaction?.booking_id) {
          await supabaseClient
            .from("bookings")
            .update({ 
              booking_status: "confirmed",
              updated_at: new Date().toISOString()
            })
            .eq("id", transaction.booking_id);
          
          logStep("Booking confirmed", { bookingId: transaction.booking_id });
        }
      }
    }

    if (eventType === "PAYMENT.CAPTURE.DENIED" || eventType === "CHECKOUT.ORDER.VOIDED") {
      const orderId = body.resource.id;
      logStep("Payment failed", { orderId, eventType });

      // Update transaction status to failed
      const { error: updateError } = await supabaseClient
        .from("transactions")
        .update({ 
          status: "failed",
          updated_at: new Date().toISOString()
        })
        .eq("transaction_id", orderId);

      if (updateError) {
        logStep("Error updating transaction", updateError);
      } else {
        logStep("Transaction updated to failed");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in paypal webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});