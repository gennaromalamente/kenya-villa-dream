-- Tabella transazioni
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  booking_id UUID REFERENCES public.bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  payment_method VARCHAR(20) NOT NULL,
  payment_provider VARCHAR(50),
  transaction_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella metodi di pagamento salvati
CREATE TABLE public.saved_payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  payment_type VARCHAR(20) NOT NULL,
  provider_token VARCHAR(255),
  last_four VARCHAR(4),
  expires_at DATE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Anyone can create transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update transactions" 
ON public.transactions 
FOR UPDATE 
USING (true);

-- RLS Policies for saved payment methods
CREATE POLICY "Users can view their own payment methods" 
ON public.saved_payment_methods 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own payment methods" 
ON public.saved_payment_methods 
FOR ALL 
USING (user_id = auth.uid());

-- Trigger for updating timestamps
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for better performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_booking_id ON public.transactions(booking_id);
CREATE INDEX idx_saved_payment_methods_user_id ON public.saved_payment_methods(user_id);