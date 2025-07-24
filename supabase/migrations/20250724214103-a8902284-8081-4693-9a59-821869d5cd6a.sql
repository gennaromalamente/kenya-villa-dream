-- Fix RLS security for existing availability table

-- Add proper RLS policies for availability table
CREATE POLICY "Public can view availability" ON public.availability
FOR SELECT USING (true);

CREATE POLICY "Only service role can modify availability" ON public.availability
FOR INSERT WITH CHECK (false); -- Only service role can insert

CREATE POLICY "Only service role can update availability" ON public.availability
FOR UPDATE USING (false); -- Only service role can update

CREATE POLICY "Only service role can delete availability" ON public.availability
FOR DELETE USING (false); -- Only service role can delete