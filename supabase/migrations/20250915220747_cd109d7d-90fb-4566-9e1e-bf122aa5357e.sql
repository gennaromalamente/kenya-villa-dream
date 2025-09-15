-- Fix security vulnerability: Restrict transaction creation to authenticated users only
-- Drop the existing permissive policy that allows anyone to create transactions
DROP POLICY IF EXISTS "Anyone can create transactions" ON public.transactions;

-- Create a new secure policy that only allows authenticated users to create their own transactions
-- or service role to create transactions (for payment processing)
CREATE POLICY "Authenticated users can create their own transactions" 
ON public.transactions 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Either the user_id matches the authenticated user
  (user_id = auth.uid()) 
  OR 
  -- Or it's a service role operation (user_id can be null for guest transactions)
  (auth.role() = 'service_role')
);

-- Also ensure service role can still create transactions for guest payments
CREATE POLICY "Service role can create transactions" 
ON public.transactions 
FOR INSERT 
TO service_role
WITH CHECK (true);