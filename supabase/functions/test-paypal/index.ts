import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[TEST-PAYPAL] Starting PayPal configuration test");

    // Check & parse PayPal credentials (supports 'id:secret', JSON, or with mode)
    const rawSecret = Deno.env.get("PAYPAL");
    if (!rawSecret) {
      return new Response(JSON.stringify({ 
        error: "PayPal credentials not found", 
        message: "Set PAYPAL secret as 'client_id:client_secret' or JSON {client_id, client_secret, mode}"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    let clientId = "";
    let clientSecret = "";
    let mode: "sandbox" | "live" = "sandbox";

    try {
      const obj = JSON.parse(rawSecret);
      clientId = obj.client_id || obj.clientId || "";
      clientSecret = obj.client_secret || obj.clientSecret || "";
      if (obj.mode && String(obj.mode).toLowerCase() === "live") mode = "live";
    } catch {
      const normalized = rawSecret.trim().replace(/\s+/g, "").replace(/[|,;]+/g, ":");
      const parts = normalized.split(":");
      if (parts.length >= 2) {
        [clientId, clientSecret] = [parts[0], parts[1]];
        if (parts[2]) mode = parts[2].toLowerCase() === "live" ? "live" : "sandbox";
      }
    }

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ 
        error: "Invalid PayPal credentials format", 
        message: "Use 'client_id:client_secret' or JSON {client_id, client_secret, mode}"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("[TEST-PAYPAL] Credentials parsed", { mode });

    // Test PayPal API connection
    const paypalBaseUrl = mode === "live" ? "https://api.paypal.com" : "https://api.sandbox.paypal.com";
    
    const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials"
    });

    console.log("[TEST-PAYPAL] PayPal auth response status:", authResponse.status);

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      return new Response(JSON.stringify({ 
        error: "PayPal API authentication failed", 
        details: `${authResponse.status} ${authResponse.statusText}`,
        message: errorText
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const authData = await authResponse.json();
    
    return new Response(JSON.stringify({
      success: true,
      message: "PayPal configuration is valid",
      details: {
        hasAccessToken: !!authData.access_token,
        tokenType: authData.token_type,
        environment: "sandbox"
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("[TEST-PAYPAL] ERROR:", errorMessage);
    return new Response(JSON.stringify({ 
      error: "Test failed", 
      message: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});