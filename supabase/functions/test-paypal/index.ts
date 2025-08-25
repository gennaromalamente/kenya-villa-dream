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

    // Check PayPal credentials
    const paypalCredentials = Deno.env.get("PAYPAL");
    if (!paypalCredentials) {
      return new Response(JSON.stringify({ 
        error: "PayPal credentials not found", 
        message: "Please add PAYPAL secret in format: client_id:client_secret"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Parse PayPal credentials
    const [clientId, clientSecret] = paypalCredentials.split(":");
    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ 
        error: "Invalid PayPal credentials format", 
        message: "PayPal credentials must be in format: client_id:client_secret"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("[TEST-PAYPAL] Credentials found, testing PayPal API connection");

    // Test PayPal API connection
    const paypalBaseUrl = "https://api.sandbox.paypal.com";
    
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