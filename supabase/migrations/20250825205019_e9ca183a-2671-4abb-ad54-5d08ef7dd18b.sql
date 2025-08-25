-- Fix critical security issue: Remove public access to sensitive booking data
-- Only allow service role and admin functions to access bookings

-- Drop the existing insecure policy that allows anyone to view bookings
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;

-- Create a new secure policy that only allows service role access for SELECT operations
-- This means only edge functions with service role access can read booking data
CREATE POLICY "Only service role can view bookings" 
ON public.bookings 
FOR SELECT 
USING (false);

-- The "Anyone can create bookings" policy can remain as it only allows INSERT operations
-- and doesn't expose existing sensitive data

-- Note: This ensures that:
-- 1. Public users can still create new bookings (INSERT remains allowed)
-- 2. Only edge functions with service role privileges can view booking data
-- 3. The admin panel will continue to work via the admin-auth edge function
-- 4. No sensitive customer data is exposed to the public