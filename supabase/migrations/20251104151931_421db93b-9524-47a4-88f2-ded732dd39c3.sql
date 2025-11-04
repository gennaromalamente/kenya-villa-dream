-- Add RLS policy to prevent unauthorized transaction updates
-- Only admin users or the transaction owner can update status

-- Policy for users to update their own transactions (though in production this should be removed)
CREATE POLICY "Users cannot update transaction status"
ON public.transactions
FOR UPDATE
USING (false)  -- Nobody can update via client
WITH CHECK (false);

-- Only service role (edge functions with service key) can update transactions
-- This is enforced by using SUPABASE_SERVICE_ROLE_KEY in edge functions

COMMENT ON TABLE public.transactions IS 'Transaction updates should only happen via edge functions with service role key. Client-side updates are blocked by RLS.';