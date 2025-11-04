import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAXELPAY_SECRET_KEY = Deno.env.get("MAXELPAY_SECRET_KEY");

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MAXELPAY-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse webhook payload
    const payload = await req.json();
    logStep("Webhook payload", payload);

    // Verify webhook authenticity (implementation depends on MaxelPay's signature method)
    // This is a placeholder - adjust based on MaxelPay's actual webhook verification
    const signature = req.headers.get("X-Signature") || req.headers.get("X-MaxelPay-Signature");
    if (!signature && MAXELPAY_SECRET_KEY) {
      logStep("Warning: No signature found in webhook");
    }

    // Extract relevant data from webhook
    const {
      order_id,
      status,
      amount,
      currency,
      transaction_hash,
      payment_status,
    } = payload;

    if (!order_id) {
      throw new Error("Missing order_id in webhook payload");
    }

    logStep("Processing payment", { order_id, status: status || payment_status });

    // Determine if payment is successful
    const isSuccessful = 
      status === "completed" || 
      status === "confirmed" ||
      status === "paid" ||
      payment_status === "completed" ||
      payment_status === "confirmed" ||
      payment_status === "paid";

    // Update transaction status
    const { data: transaction, error: fetchError } = await supabaseClient
      .from("transactions")
      .select("*")
      .eq("transaction_id", order_id)
      .maybeSingle();

    if (fetchError) {
      logStep("Error fetching transaction", fetchError);
      throw new Error(`Failed to fetch transaction: ${fetchError.message}`);
    }

    if (!transaction) {
      logStep("Transaction not found", { order_id });
      throw new Error(`Transaction not found: ${order_id}`);
    }

    // Only update if status changed
    if (transaction.status !== (isSuccessful ? "completed" : "failed")) {
      const { error: updateError } = await supabaseClient
        .from("transactions")
        .update({
          status: isSuccessful ? "completed" : "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("transaction_id", order_id);

      if (updateError) {
        logStep("Error updating transaction", updateError);
        throw new Error(`Failed to update transaction: ${updateError.message}`);
      }

      logStep("Transaction updated", {
        order_id,
        status: isSuccessful ? "completed" : "failed",
      });

      // If payment successful, update booking status
      if (isSuccessful && transaction.booking_id) {
        const { error: bookingError } = await supabaseClient
          .from("bookings")
          .update({
            status: "confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", transaction.booking_id);

        if (bookingError) {
          logStep("Error updating booking", bookingError);
        } else {
          logStep("Booking confirmed", { booking_id: transaction.booking_id });
        }
      }
    } else {
      logStep("Transaction status unchanged", { order_id, status: transaction.status });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
