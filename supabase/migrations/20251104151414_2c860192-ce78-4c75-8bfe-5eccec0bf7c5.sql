-- Remove 'paypal' from payment_method CHECK constraint in transactions table
-- First, drop the existing constraint
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_payment_method_check;

-- Add new constraint without 'paypal'
ALTER TABLE public.transactions ADD CONSTRAINT transactions_payment_method_check 
CHECK (payment_method IN ('stripe', 'crypto'));

-- Update any existing paypal records to 'stripe' (safe since count is 0)
UPDATE public.transactions SET payment_method = 'stripe' WHERE payment_method = 'paypal';

-- Add comment to document the change
COMMENT ON COLUMN public.transactions.payment_method IS 'Payment method used: stripe or crypto. PayPal removed as of migration.';