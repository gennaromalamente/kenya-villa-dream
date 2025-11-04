import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingRequest {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  special_requests?: string;
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
      const bookingData: BookingRequest = await req.json();
      console.log('Booking request received:', bookingData);

      // Validate required fields
      if (!bookingData.guest_name || !bookingData.guest_email || 
          !bookingData.check_in || !bookingData.check_out) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if any dates are explicitly marked as unavailable
      const { data: unavailableDates, error: availabilityError } = await supabaseClient
        .from('availability')
        .select('*')
        .gte('date', bookingData.check_in)
        .lt('date', bookingData.check_out)
        .eq('is_available', false);

      if (availabilityError) {
        console.error('Error checking availability:', availabilityError);
        return new Response(JSON.stringify({ 
          error: 'Error checking availability' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If any dates are explicitly unavailable, reject the booking
      if (unavailableDates && unavailableDates.length > 0) {
        return new Response(JSON.stringify({ 
          error: 'Some dates are not available for booking',
          unavailable_dates: unavailableDates.map(d => d.date)
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate total nights
      const checkIn = new Date(bookingData.check_in);
      const checkOut = new Date(bookingData.check_out);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Get available dates with custom pricing (if any)
      const { data: pricedDates } = await supabaseClient
        .from('availability')
        .select('*')
        .gte('date', bookingData.check_in)
        .lt('date', bookingData.check_out);

      // Calculate total price using custom prices or default price
      const defaultPricePerNight = 150; // Default from table
      let totalPrice = 0;
      
      if (pricedDates && pricedDates.length > 0) {
        // Use custom prices where available, default price for other nights
        const customPriceDays = pricedDates.length;
        const defaultPriceDays = totalNights - customPriceDays;
        totalPrice = pricedDates.reduce((sum, day) => sum + parseFloat(day.price_per_night), 0) +
                     (defaultPriceDays * defaultPricePerNight);
      } else {
        // All nights use default price
        totalPrice = totalNights * defaultPricePerNight;
      }

      // Create booking
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .insert({
          guest_name: bookingData.guest_name,
          guest_email: bookingData.guest_email,
          guest_phone: bookingData.guest_phone,
          check_in: bookingData.check_in,
          check_out: bookingData.check_out,
          guests_count: bookingData.guests_count,
          total_price: totalPrice,
          special_requests: bookingData.special_requests,
          status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        return new Response(JSON.stringify({ 
          error: 'Error creating booking' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Mark dates as unavailable (optional - depends on business logic)
      // await supabaseClient
      //   .from('availability')
      //   .update({ is_available: false })
      //   .gte('date', bookingData.check_in)
      //   .lt('date', bookingData.check_out);

      // Send confirmation email (you would integrate with your email service)
      console.log('Booking created successfully:', booking);

      return new Response(JSON.stringify({ 
        success: true, 
        booking_id: booking.id,
        total_price: totalPrice,
        total_nights: totalNights
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      // Get availability for calendar
      const url = new URL(req.url);
      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');

      let query = supabaseClient.from('availability').select('*');
      
      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data: availability, error } = await query.order('date');

      if (error) {
        console.error('Error fetching availability:', error);
        return new Response(JSON.stringify({ error: 'Error fetching availability' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ availability }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error) {
    console.error('Booking system error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});