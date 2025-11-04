import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RAW_MAXELPAY_ENV = Deno.env.get("MAXELPAY_ENV") || "prod";
const ENV_LC = RAW_MAXELPAY_ENV.toLowerCase();
const MAXELPAY_ENV = (ENV_LC === "stg" || ENV_LC === "sandbox" || ENV_LC === "dev" || ENV_LC === "test") ? "stg" : "prod";
const MAXELPAY_API_KEY = Deno.env.get("MAXELPAY_API_KEY");
const MAXELPAY_SECRET_KEY = Deno.env.get("MAXELPAY_SECRET_KEY");
const MAXELPAY_API_URL = `https://api.maxelpay.com/v1/${MAXELPAY_ENV}/merchant/order/checkout`;

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CRYPTO-PAYMENT] ${step}${detailsStr}`);
};

// AES-256-CBC encryption function compatible with MaxelPay
async function encryptPayload(payload: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  
  // Use first 16 bytes of secret key as IV (as per MaxelPay docs)
  const iv = encoder.encode(secretKey.substring(0, 16));
  const keyData = encoder.encode(secretKey);
  
  // Import key for AES-CBC
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );
  
  // Encrypt
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    encoder.encode(payload)
  );
  
  // Convert to base64
  return base64Encode(new Uint8Array(encryptedData));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started", { env: MAXELPAY_ENV, url: MAXELPAY_API_URL });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header or default to guest
    let user: { id: string; email?: string } = { id: "guest", email: "guest@example.com" };
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseClient.auth.getUser(token);
        if (userData.user) {
          user = userData.user as unknown as { id: string; email?: string };
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
      orderID: paymentId,
      amount: parseFloat(amount).toString(),
      currency: (currency as string).toUpperCase(),
      redirectUrl: returnUrl,
      webhookUrl: callbackUrl,
      timestamp: Math.floor(Date.now() / 1000).toString(),
    };

    logStep("Creating MaxelPay order", { order: maxelPayOrder });

    // Encrypt payload as per MaxelPay requirements
    const payloadJson = JSON.stringify(maxelPayOrder);
    const encryptedPayload = await encryptPayload(payloadJson, MAXELPAY_SECRET_KEY);
    
    logStep("Payload encrypted");

    // Call MaxelPay API with encrypted payload
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const maxelPayResponse = await fetch(MAXELPAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MAXELPAY_API_KEY,
      },
      body: JSON.stringify({ data: encryptedPayload }),
      signal: controller.signal,
    }).catch((e) => {
      logStep("MaxelPay network/timeout error", { message: String(e) });
      return new Response(null, { status: 599, statusText: "Network Timeout" }) as any;
    });

    clearTimeout(timeout);

    logStep("MaxelPay response status", {
      status: (maxelPayResponse as Response).status,
      statusText: (maxelPayResponse as Response).statusText,
    });

    if (!(maxelPayResponse as Response).ok) {
      const errorText = await (maxelPayResponse as Response).text();
      logStep("MaxelPay API error", { status: (maxelPayResponse as Response).status, error: errorText });

      // Graceful fallback for provider/transient errors (>=500 or timeout 599)
      if ((maxelPayResponse as Response).status >= 500 || (maxelPayResponse as Response).status === 599) {
        const cryptoPaymentUrl = `${baseUrl}/crypto-payment?payment_id=${paymentId}&amount=${amount}&currency=${currency}`;

        const { error: insertPendingError } = await supabaseClient
          .from("transactions")
          .insert({
            transaction_id: paymentId,
            booking_id,
            user_id: user.id === "guest" ? null : user.id,
            amount: parseFloat(amount),
            currency: (currency as string).toUpperCase(),
            payment_method: "crypto",
            payment_provider: "maxelpay",
            status: "pending",
          } as any);

        if (insertPendingError) {
          logStep("Error inserting pending transaction after provider error", insertPendingError);
          throw new Error(`Failed to create transaction record: ${insertPendingError.message}`);
        }

        logStep("Transaction created with fallback due to provider error", { paymentId });

        return new Response(JSON.stringify({
          payment_id: paymentId,
          payment_url: cryptoPaymentUrl,
          amount,
          currency,
          status: "pending",
          message: "Provider unavailable, using local crypto checkout"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // For 4xx or other errors, return a proper failure
      throw new Error(`MaxelPay API error (${(maxelPayResponse as Response).status}): ${errorText}`);
    }

    const maxelPayData = await (maxelPayResponse as Response).json();
    logStep("MaxelPay response", maxelPayData);

    const cryptoPaymentUrl = maxelPayData.payment_url || maxelPayData.checkout_url || 
                             maxelPayData.data?.payment_url || maxelPayData.data?.checkout_url ||
                             `${baseUrl}/crypto-payment?payment_id=${paymentId}`;

    // Insert transaction record
    const { error: insertError } = await supabaseClient
      .from("transactions")
      .insert({
        transaction_id: paymentId,
        booking_id,
        user_id: user.id === "guest" ? null : user.id,
        amount: parseFloat(amount),
        currency: (currency as string).toUpperCase(),
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
