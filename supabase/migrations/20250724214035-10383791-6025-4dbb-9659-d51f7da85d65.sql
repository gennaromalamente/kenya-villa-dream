-- Fix critical RLS security issues

-- Add proper RLS policies for availability table
CREATE POLICY "Public can view availability" ON public.availability
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify availability" ON public.availability
FOR INSERT WITH CHECK (false); -- Only service role can insert

CREATE POLICY "Only admins can update availability" ON public.availability
FOR UPDATE USING (false); -- Only service role can update

CREATE POLICY "Only admins can delete availability" ON public.availability
FOR DELETE USING (false); -- Only service role can delete

-- Fix WhatsApp messages policy to be more restrictive
DROP POLICY IF EXISTS "Admin can manage WhatsApp messages" ON public.whatsapp_messages;

CREATE POLICY "Only authenticated users can view WhatsApp messages" ON public.whatsapp_messages
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only service role can manage WhatsApp messages" ON public.whatsapp_messages
FOR INSERT WITH CHECK (false); -- Only service role via webhook

CREATE POLICY "Only service role can update WhatsApp messages" ON public.whatsapp_messages
FOR UPDATE USING (false);

CREATE POLICY "Only service role can delete WhatsApp messages" ON public.whatsapp_messages
FOR DELETE USING (false);

-- Add missing UPDATE/DELETE policies for reviews
CREATE POLICY "Only verified guests can update reviews" ON public.reviews
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete reviews" ON public.reviews
FOR DELETE USING (false); -- Only service role can delete

-- Add proper policies for bookings UPDATE/DELETE
CREATE POLICY "Only booking owners can delete bookings" ON public.bookings
FOR DELETE USING (auth.uid() = user_id OR guest_email = auth.email());