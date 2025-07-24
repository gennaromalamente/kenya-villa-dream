import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  from: string;
  body: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const body = await req.json();
      console.log('WhatsApp webhook received:', body);

      // Handle WhatsApp webhook for incoming messages
      if (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from;
        const text = message.text?.body || '';

        // Store incoming message in database
        const { error } = await supabaseClient
          .from('whatsapp_messages')
          .insert({
            guest_phone: from,
            message_text: text,
            message_type: 'incoming',
            is_read: false
          });

        if (error) {
          console.error('Error storing WhatsApp message:', error);
        }

        // Auto-reply with villa information
        const autoReply = {
          messaging_product: "whatsapp",
          to: from,
          type: "text",
          text: {
            body: "🏖️ Ciao! Grazie per averci contattato per la Villa Kenya. Un nostro operatore ti risponderà a breve. Nel frattempo puoi visitare il nostro sito per vedere disponibilità e prezzi. 🌴"
          }
        };

        // Send auto-reply via WhatsApp Business API
        const whatsappToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
        if (whatsappToken) {
          await fetch(`https://graph.facebook.com/v17.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(autoReply)
          });
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle webhook verification
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'villa_kenya_verify';

      if (mode === 'subscribe' && token === verifyToken) {
        return new Response(challenge, { status: 200 });
      }

      return new Response('Forbidden', { status: 403 });
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});