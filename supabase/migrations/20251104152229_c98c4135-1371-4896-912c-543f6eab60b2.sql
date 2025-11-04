-- Fix RLS policies for bookings and transactions to prevent guest data exposure

-- BOOKINGS: Remove the policy that exposes NULL user_id bookings to all authenticated users
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Add proper policy: users can only see their OWN bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

-- Guest bookings (NULL user_id) remain visible only to admins via existing admin policy

-- TRANSACTIONS: Remove the policy that exposes NULL user_id transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;

-- Add proper policy: users can only see their OWN transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (auth.uid() = user_id);

-- WHATSAPP_MESSAGES: Block unauthorized inserts
CREATE POLICY "Only edge functions can insert messages"
ON public.whatsapp_messages
FOR INSERT
WITH CHECK (false);  -- Only service role (edge functions) can insert

-- USER_ROLES: Block unauthorized role manipulation
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));